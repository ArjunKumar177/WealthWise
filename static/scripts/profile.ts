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
