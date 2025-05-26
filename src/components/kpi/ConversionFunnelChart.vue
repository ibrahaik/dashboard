<template>
  <ion-card class="chart-card">
    <ion-card-header>
      <ion-card-title>Embudo de Conversión</ion-card-title>
      <ion-card-subtitle>Proceso de reserva completo</ion-card-subtitle>
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
  { stage: 'Visitantes', value: 100000, percentage: 100 },
  { stage: 'Búsquedas', value: 75000, percentage: 75 },
  { stage: 'Resultados Vistos', value: 45000, percentage: 45 },
  { stage: 'Vuelo Seleccionado', value: 25000, percentage: 25 },
  { stage: 'Datos Ingresados', value: 15000, percentage: 15 },
  { stage: 'Pago Iniciado', value: 12000, percentage: 12 },
  { stage: 'Reserva Completada', value: 10500, percentage: 10.5 }
];

let chart = null;

onMounted(() => {
  const options = {
    series: [{
      name: 'Usuarios',
      data: funnelData.map(item => item.value)
    }],
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      },
      fontFamily: 'inherit',
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        barHeight: '80%',
        borderRadius: 8
      }
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'middle',
      style: {
        colors: ['#fff'],
        fontWeight: 'bold',
        fontSize: '12px'
      },
      formatter: function(val, opt) {
        const percentage = funnelData[opt.dataPointIndex].percentage;
        return `${val.toLocaleString()} (${percentage}%)`;
      }
    },
    colors: [
      '#ffcc00', '#ffd633', '#ffe066', '#ffeb99', '#fff5cc', '#fff9e6', '#fffcf0'
    ],
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
          const percentage = funnelData[opts.dataPointIndex].percentage;
          return `${val.toLocaleString()} usuarios (${percentage}%)`;
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
