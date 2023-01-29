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
  });
});

// document.querySelector('#submit')!.addEventListener('click', () => {
    
// });

declare const username: string;

$('#submitTransaction').on('click', function() {
  var date = $('#datePicker').val();
  var transaction_type = $('transaction_type').val();
  var catogaries_type = $('catogaries_type').val();
  var amount = $('amount').val();
  $.post('/transactions', {
    "username" : username,
    "date": date, 
    "transaction_type": transaction_type,
    "category": catogaries_type,
    "amount": amount
  });
});
