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

// document.querySelector('#submit')!.addEventListener('click', () => {

// });

$('#transaction_row').on('submit', e => {
  e.preventDefault();
  let body = new FormData();
  body.append('date', $('#datePicker').val()!.toString() || (new Date()).toISOString().slice(0, 10));
  body.append('transaction_type', $('#transaction_type').val()!.toString() || '0');
  body.append('category', $('#category_types').val()!.toString() || '0');
  body.append('amount', $('#amount').val()!.toString() || '0');
  fetch('/transaction', {
    method: 'POST',
    body,
  }).then(result => {
    console.log(result);
  })

});
