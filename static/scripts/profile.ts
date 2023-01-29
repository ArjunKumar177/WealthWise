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

$('#transaction_row').on('submit', e => {
  e.preventDefault();
  let body = new FormData();
  body.append('username', username);
  body.append('date', $('#datePicker').val()!.toString() || '0');
  body.append('transaction_type', $('#transaction_type').val()!.toString() || '0');
  body.append('category', $('#catogaries_type').val()!.toString() || '0');
  body.append('amount', $('#amount').val()!.toString() || '0');
  fetch('/transaction', {
    method: 'POST',
    body,
  }).then(result => {
    console.log(result);
  })

});
