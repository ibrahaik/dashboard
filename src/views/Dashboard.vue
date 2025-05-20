<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="vueling">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <div class="title-container">
            <span>Dashboard de Negocio</span>
          </div>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon :icon="notificationsOutline"></ion-icon>
          </ion-button>
          <ion-button>
            <ion-icon :icon="personCircleOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <div class="dashboard-container">
        <ion-grid class="ion-no-padding">
          <ion-row class="ion-padding">
            <ion-col size="12" size-md="6" class="ion-padding-horizontal ion-padding-bottom">
              <BookingsLineChart />
            </ion-col>
            <ion-col size="12" size-md="6" class="ion-padding-horizontal ion-padding-bottom">
              <RevenueColumnChart />
            </ion-col>
          </ion-row>
          
          <ion-row class="ion-padding">
            <ion-col size="12" size-md="4" class="ion-padding-horizontal ion-padding-bottom">
              <PaymentMethodsPieChart />
            </ion-col>
            <ion-col size="12" size-md="4" class="ion-padding-horizontal ion-padding-bottom">
              <RealtimeUsersChart />
            </ion-col>
            <ion-col size="12" size-md="4" class="ion-padding-horizontal ion-padding-bottom">
              <SearchHeatmapChart />
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonMenuButton } from '@ionic/vue';
import { notificationsOutline, personCircleOutline } from 'ionicons/icons';
import BookingsLineChart from '../components/BookingsLineChart.vue';
import RevenueColumnChart from '../components/RevenueColumnChart.vue';
import PaymentMethodsPieChart from '../components/PaymentMethodsPieChart.vue';
import RealtimeUsersChart from '../components/RealTimeUsersChart.vue';
import SearchHeatmapChart from '../components/SearchHeatmapChart.vue';
</script>

<style scoped>
ion-content {
  --background: #f5f7fa;
}

ion-toolbar {
  --background: #ffcc00;
  --color: #333;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dashboard-container {
  max-width: 1600px;
  margin: 0 auto;
}

ion-grid {
  height: 100%;
}

ion-row {
  margin: 0;
}

ion-col {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  ion-col {
    padding: 8px;
  }
}
</style>
