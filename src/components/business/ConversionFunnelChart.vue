<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Tasa de Conversión</ion-card-title>
      <ion-card-subtitle>Embudo de compra | Unidad: Porcentaje (%)</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div id="funnel-chart"></div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';
import ApexCharts from 'apexcharts';

// Datos del embudo de conversión
const funnelData = [
  { stage: 'Visitantes', users: 100000, percentage: 100 },
  { stage: 'Búsquedas', users: 68000, percentage: 68 },
  { stage: 'Selección', users: 34000, percentage: 34 },
  { stage: 'Pago', users: 18700, percentage: 18.7 },
  { stage: 'Completado', users: 15200, percentage: 15.2 }
];

let chart = null;

onMounted(() => {
  const options = {
    series: [{
      name: 'Conversión',
      data: funnelData.map(item => item.percentage)
    }],
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      },
      fontFamily: 'inherit'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        barHeight: '70%',
        borderRadius: 8
      }
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'middle',
      style: {
        colors: ['#fff'],
        fontWeight: 'bold',
        fontSize: '11px'
      },
      formatter: function(val, opt) {
        const data = funnelData[opt.dataPointIndex];
        return `${data.users.toLocaleString()} (${val}%)`;
      }
    },
    colors: ['#ffcc00', '#ffd633', '#ffe066', '#ffeb99', '#fff5cc'],
    xaxis: {
      categories: funnelData.map(item => item.stage),
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#666',
          fontSize: '11px'
        }
      }
    },
    grid: {
      show: false
    },
    tooltip: {
      theme: 'light',
      x: {
        show: false
      },
      y: {
        formatter: function(val, opts) {
          const data = funnelData[opts.dataPointIndex];
          return `${data.users.toLocaleString()} usuarios (${val}%)`;
        }
      }
    },
    legend: {
      show: false
    }
  };

  chart = new ApexCharts(document.querySelector("#funnel-chart"), options);
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

#funnel-chart {
  width: 100%;
  height: 100%;
}
</style>
