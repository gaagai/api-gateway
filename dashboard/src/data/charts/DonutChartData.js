let generatedData

export const getDonutChartData = (themes) => {
  if (generatedData) {
    generatedData.datasets[0].backgroundColor = [themes.danger, themes.info, themes.primary]
  } else {
    generatedData = {
      labels: ['North America', 'Southern America', 'Australia'],
      datasets: [{
        label: 'Population (millions)',
        backgroundColor: [themes.danger, themes.info, themes.primary],
        data: [2478, 300, 734],
      }],
    }
  }

  return generatedData
}
