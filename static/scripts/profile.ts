$('#completeProfile').on('submit', e => {
  e.preventDefault();
  let data = new FormData();
  data.append('budget', $('#budget').val()!.toString() || '0');
  data.append('income', $('#income').val()!.toString() || '0');
  data.append('account', $('#account').val()!.toString() || '0');
  fetch('/completeProfile', {
    method: 'POST',
    body: data,
  }).then(result => {
    console.log(result);
  });
});
