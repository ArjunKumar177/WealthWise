document.querySelector<HTMLInputElement>('#datePicker')!.valueAsDate = new Date();

function reloadMenus() {
  if ($('#transactionType').val() === 'income') {
    $('#incomeTypes').show();
    $('#expenditureTypes').hide();
  } else {
    $('#expenditureTypes').show();
    $('#incomeTypes').hide();
  }
}

reloadMenus();

$('#transactionType').on('change', reloadMenus);

$('#completeProfile').on('submit', e => {
  e.preventDefault();
  let body = new FormData();
  body.append('budget', $('#budget').val()!.toString() || '0');
  body.append('income', $('#income').val()!.toString() || '0');
  body.append('account', $('#account').val()!.toString() || '0');
  fetch('/completeProfile', {
    method: 'POST',
    body,
  }).then(result => {
    console.log(result);
    result.text().then(text => {
      if (text === 'success') location.reload();
    });
  });
});

$('#newTransaction').on('submit', e => {
  e.preventDefault();
  let body = new FormData();
  let transactionType = $('#transactionType').val()!.toString();
  let category;
  if (transactionType === 'income') {
    category = $('#incomeTypes').val()!.toString();
  } else {
    category = $('#expenditureTypes').val()!.toString();
  }
  body.append('date', $('#datePicker').val()!.toString() || (new Date()).toISOString().slice(0, 10));
  body.append('transaction_type', transactionType);
  body.append('category', category);
  body.append('amount', $('#amount').val()!.toString() || '0');
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
