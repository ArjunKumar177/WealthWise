const ctx = document.getElementById('pie');

// @ts-ignore
new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
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
