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

document.querySelector('#expenditure')!.addEventListener('click', () => {
  document.querySelector<HTMLDialogElement>('#expenditureDialog')!.show();
  document.querySelector<HTMLDivElement>('#overlay')!.style.display = 'block';
});

document.querySelector('#overlay')!.addEventListener('click', () => {
  document.querySelectorAll<HTMLDialogElement>('dialog').forEach(x => x.close());
  document.querySelector<HTMLDivElement>('#overlay')!.style.display = 'none';
})
