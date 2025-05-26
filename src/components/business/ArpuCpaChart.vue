<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>ARPU vs CPA</ion-card-title>
      <ion-card-subtitle>Ingreso medio vs Coste por adquisición | Unidad: Euros (€)</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div id="arpu-cpa-chart"></div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';
import ApexCharts from 'apexcharts';

// Datos ARPU vs CPA por trimestre
const arpuCpaData = {
  categories: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
  arpu: [142, 156, 168, 175],
  cpa: [28, 32, 29, 26]
};

let chart = null;

onMounted(() => {
  const options = {
    series: [
      {
        name: 'ARPU (€)',
        type: 'column',
        data: arpuCpaData.arpu
      },
      {
        name: 'CPA (€)',
        type: 'column',
        data: arpuCpaData.cpa
      }
    ],
    chart: {
      height: 300,
      type: 'line',
      toolbar: {
        show: false
      },
      fontFamily: 'inherit'
    },
    stroke: {
      width: [0, 0]
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        borderRadius: 4
      }
    },
    colors: ['#ffcc00', '#ff6b6b'],
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1],
      formatter: function(val) {
        return '€' + val;
      },
      style: {
        fontWeight: 'bold'
      }
    },
    labels: arpuCpaData.categories,
    xaxis: {
      type: 'category',
      title: {
        text: 'Trimestre',
        style: {
          color: '#666',
          fontWeight: 'bold'
        }
      },
      labels: {
        style: {
          colors: '#666'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Euros (€)',
        style: {
          color: '#666',
          fontWeight: 'bold'
        }
      },
      labels: {
        formatter: function(val) {
          return '€' + val;
        },
        style: {
          colors: '#666'
        }
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function(val) {
          return '€' + val;
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center'
    },
    grid: {
      borderColor: 'rgba(200, 200, 200, 0.2)'
    },
    annotations: {
      line1: {
        type: 'line',
        yMin: 180,
        yMax: 180,
        borderColor: '#ff4757',
        borderWidth: 2,
        borderDash: [10, 5],
        label: {
          content: 'Objetivo ARPU: €180',
          enabled: true,
          position: 'end'
        }
      },
      line2: {
        type: 'line',
        yMin: 25,
        yMax: 25,
        borderColor: '#ff4757',
        borderWidth: 2,
        borderDash: [10, 5],
        label: {
          content: 'Objetivo CPA: €25',
          enabled: true,
          position: 'start'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        horizontalAlign: 'center'
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: 180,
            yMax: 180,
            borderColor: '#ff4757',
            borderWidth: 2,
            borderDash: [10, 5]
          },
          line2: {
            type: 'line',
            yMin: 25,
            yMax: 25,
            borderColor: '#ff4757',
            borderWidth: 2,
            borderDash: [10, 5]
          }
        }
      }
    }
  };

  chart = new ApexCharts(document.querySelector("#arpu-cpa-chart"), options);
  chart.render();
});

onUnmounted(() => {
  if (chart) {
    chart.destroy();
  }
});
</script>

<style scoped>
.chart-card {
  height: 100%;
  border-top: 3px solid #ffcc00;
}

ion-card-content {
  height: 300px;
}

#arpu-cpa-chart {
  width: 100%;
  height: 100%;
}
</style>
