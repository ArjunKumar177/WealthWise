$('#completeProfile').on('submit', e => {
  e.preventDefault();
  $.post('/completeProfile', {
    budget: $('#budget').val(),
    income: $('#income').val(),
    account: $('#account').val(),
  }, result => {
    console.log(result);
  });
});
