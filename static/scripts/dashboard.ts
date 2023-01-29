const ctx = document.getElementById('pie');

declare const chart_labels: Array<string>;
declare const chart_data: Array<number>;

// @ts-ignore
new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: chart_labels,
    datasets: [{
      label: 'amount',
      data: chart_data,
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

$('#expenditure').on('click', () => {
  $('#expenditureDialog, #overlay').show();
});

$('#income').on('click', () => {
  $('#incomeDialog, #overlay').show();
});

$('#overlay').on('click', () => {
  $('dialog, #overlay').hide();
});

$('#expenditureDialog form').on('submit', e => {
  e.preventDefault();
  let body = new FormData();
  body.append('date', (new Date()).toISOString().slice(0, 10));
  body.append('amount', $('#newExpenditure').val()!.toString() || '0');
  body.append('category', $('#category').val()!.toString() || '0');
  body.append('transaction_type', 'expenditure');
  fetch('/transaction', {
    method: 'POST',
    body,
  }).then(result => {
    console.log(result);
    result.text().then(text => {
      if (text === 'success') location.reload();
    });
  });
});

$('#incomeDialog form').on('submit', e => {
  e.preventDefault();
  let body = new FormData();
  body.append('date', (new Date()).toISOString().slice(0, 10));
  body.append('amount', $('#newIncome').val()!.toString() || '0');
  body.append('category', $('#incomeTypes').val()!.toString() || '0');
  body.append('transaction_type', 'income');
  fetch('/transaction', {
    method: 'POST',
    body,
  }).then(result => {
    console.log(result);
    result.text().then(text => {
      if (text === 'success') location.reload();
    });
  });
});
