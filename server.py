import json
from os import environ as env
from urllib.parse import quote_plus, urlencode

import pymongo
from authlib.integrations.flask_client import OAuth
from dotenv import find_dotenv, load_dotenv
from flask import Flask, redirect, render_template, session, url_for, request, send_from_directory

from pymongo import MongoClient, DESCENDING
from datetime import datetime
from bson.objectid import ObjectId
from bson import json_util

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

app = Flask(__name__)
app.secret_key = env.get("APP_SECRET_KEY")

oauth = OAuth(app)

oauth.register(
    "auth0",
    client_id=env.get("AUTH0_CLIENT_ID"),
    client_secret=env.get("AUTH0_CLIENT_SECRET"),
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f'https://{env.get("AUTH0_DOMAIN")}/.well-known/openid-configuration',
)

cluster = env.get("MONGODB_CLUSTER")
client = MongoClient(cluster)
db = client['wealthwise']
transactions = db['transactions']
users = db['users']


@app.template_filter()
def date(value):
    return value.split('T')[0].replace('-', ' / ')


# Controllers API
@app.route("/")
def get_index():
    return render_template(
        "index.html",
        session=session.get("user"),
        pretty=json.dumps(session.get("user"), indent=4),
    )


@app.route('/<directory>/<path>')
def send_static_styles(directory, path):
    return send_from_directory('static/' + directory, path)


@app.route("/dashboard")
def get_dashboard():
    if len(session):
        object_id = session.get('user')['userinfo']['sub'][6:]
        user = users.find_one({'_id': ObjectId(object_id)})
        documents = list(transactions.find({'user_id': ObjectId(object_id)}))
        if user.get('profile_completed'):
            hashCategories = {"meals": 0, "groceries": 0, "movies": 0, "clothes": 0, "school": 0, "home": 0, "entertainment": 0, "investment": 0, "other": 0 }
            for transaction in documents:
                if transaction['transaction_type'] == "expenditure" and transaction['category'] in hashCategories:
                    hashCategories[transaction['category']] += transaction['amount']
            chart_data = []
            chart_label = []
            for k, v in hashCategories.items():
                if v != 0:
                    chart_data.append(v)
                    chart_label.append(k)

            return render_template(
                "dashboard.html",
                user=user,
                session=session.get("user"),
                pretty=json.dumps(session.get("user"), indent=4),
                chart_labels = chart_label,
                chart_data = chart_data,
            )
        else:
            return redirect("/profile")
    else:
        return redirect("/")


@app.route("/callback", methods=["GET", "POST"])
def callback():
    token = oauth.auth0.authorize_access_token()
    session["user"] = token
    return redirect("/dashboard")


@app.route("/login")
def get_login():
    return oauth.auth0.authorize_redirect(
        redirect_uri=url_for("callback", _external=True)
    )


@app.route("/profile")
def profile():
    if len(session):
        object_id = session.get('user')['userinfo']['sub'][6:]
        user = users.find_one({'_id': ObjectId(object_id)})
        documents = list(transactions.find({'user_id': ObjectId(object_id)}).sort([('date', DESCENDING)]))
        return render_template(
            "profile.html",
            user=user,
            session=session.get("user"),
            pretty=json.dumps(session.get("user"), indent=4),
            transactions=json.loads(json_util.dumps(documents))
        )
    else:
        return redirect("/")


@app.route("/logout")
def get_logout():
    session.clear()
    return redirect(
        "https://"
        + env.get("AUTH0_DOMAIN")
        + "/v2/logout?"
        + urlencode(
            {
                "returnTo": url_for("get_index", _external=True),
                "client_id": env.get("AUTH0_CLIENT_ID"),
            },
            quote_via=quote_plus,
        )
    )


@app.route("/transaction", methods=["POST"])
def add_transaction():
    object_id = session.get('user')['userinfo']['sub'][6:]

    transaction_type = request.form.get('transaction_type')
    amount = request.form.get('amount')
    category = request.form.get('category')
    date = request.form.get('date')

    if transaction_type == 'income':
        users.update_one({'_id': ObjectId(object_id)}, {'$inc': {
            'account': int(amount)
        }})
    elif category == 'investment':
        users.update_one({'_id': ObjectId(object_id)}, {'$inc': {
            'invested': int(amount)
        }})
    else:
        users.update_one({'_id': ObjectId(object_id)}, {'$inc': {
            'expenditure': int(amount)
        }})

    transactions.insert_one({
        "user_id": ObjectId(object_id),
        "date": datetime.strptime(date, '%Y-%m-%d'),
        "transaction_type": transaction_type,
        "amount": int(amount),
        "category": category,
    })

    return 'success'


@app.route("/completeProfile", methods=["POST"])
def post_complete_profile():
    users.update_one(
        {
            '_id': ObjectId(session.get('user')['userinfo']['sub'][6:])
        },
        {
            '$set': {
                'budget': int(request.form.get('budget')),
                'income': int(request.form.get('income')),
                'account': int(request.form.get('account')),
                'profile_completed': True,
            },
        }
    )
    users.update_one(
        {
            '_id': ObjectId(session.get('user')['userinfo']['sub'][6:]),
            'expenditure': {'$exists': False},
            'invested': {'$exists': False},
        },
        {
            '$set': {
                'expenditure': 0,
                'invested': 0,
            },
        }
    )
    return 'success'


if __name__ == "__main__":
    app.run(debug=True, port=env.get("PORT", 4242))
