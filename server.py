import json
from os import environ as env
from urllib.parse import quote_plus, urlencode
from markupsafe import escape
from authlib.integrations.flask_client import OAuth
from dotenv import find_dotenv, load_dotenv
from flask import Flask, redirect, render_template, session, url_for, request, send_from_directory

from pymongo import MongoClient
import datetime
from bson.objectid import ObjectId

cluster = "mongodb+srv://SAA:1234@cluster0.vvmlbuq.mongodb.net/test?retryWrites=true&w=majority"
client = MongoClient(cluster)

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

cluster = "mongodb+srv://SAA:1234@cluster0.vvmlbuq.mongodb.net/test?retryWrites=true&w=majority"
client = MongoClient(cluster)
db = client.wealthwise
transactions = db.transactions
users = db.users


# Controllers API
@app.route("/")
def get_index():
    return render_template(
        "index.html",
        session=session.get("user"),
        pretty=json.dumps(session.get("user"), indent=4),
    )


@app.route("/dashboard")
def get_dashboard():
    return render_template(
        "dashboard.html",
        session=session.get("user"),
        pretty=json.dumps(session.get("user"), indent=4),
    )


@app.route("/callback", methods=["GET", "POST"])
def callback():
    token = oauth.auth0.authorize_access_token()
    session["user"] = token
    return redirect("/")


@app.route("/login")
def get_login():
    return oauth.auth0.authorize_redirect(
        redirect_uri=url_for("callback", _external=True)
    )


@app.route("/logout")
def get_logout():
    session.clear()
    return redirect(
        "https://"
        + env.get("AUTH0_DOMAIN")
        + "/v2/logout?"
        + urlencode(
            {
                "returnTo": url_for("home", _external=True),
                "client_id": env.get("AUTH0_CLIENT_ID"),
            },
            quote_via=quote_plus,
        )
    )


@app.route("/transaction", methods=["POST"])
def add_transaction():
    if request.method == 'POST':
        name = request.form.get('name')
        result = users.find_one({"name"})
        print(result)


if __name__ == "__main__":
    app.run(debug=True, port=env.get("PORT", 8000))
