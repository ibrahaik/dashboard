<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="vueling">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <div class="title-container">
            <ion-icon :icon="codeSlashOutline" class="title-icon"></ion-icon>
            <span>KPIs Técnicos</span>
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
              <EndpointLatencyChart />
            </ion-col>
            <ion-col size="12" size-md="6" class="ion-padding-horizontal ion-padding-bottom">
              <DauMauRatioChart />
            </ion-col>
          </ion-row>
          
          <ion-row class="ion-padding">
            <ion-col size="12" size-md="4" class="ion-padding-horizontal ion-padding-bottom">
              <CrashRateChart />
            </ion-col>
            <ion-col size="12" size-md="4" class="ion-padding-horizontal ion-padding-bottom">
              <LoadTimeOsChart />
            </ion-col>
            <ion-col size="12" size-md="4" class="ion-padding-horizontal ion-padding-bottom">
              <BugsSprintChart />
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonMenuButton } from '@ionic/vue';
import { notificationsOutline, personCircleOutline, codeSlashOutline } from 'ionicons/icons';
import EndpointLatencyChart from '../components/technical/EndpointLatencyChart.vue';
import DauMauRatioChart from '../components/technical/DauMauRatioChart.vue';
import CrashRateChart from '../components/technical/CrashRateChart.vue';
import LoadTimeOsChart from '../components/technical/LoadTimeOsChart.vue';
import BugsSprintChart from '../components/technical/BugsSprintChart.vue';
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

.title-icon {
  font-size: 1.2rem;
}

.dashboard-container {
  max-width: 1600px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  padding: 2rem 1rem 1rem;
  background: linear-gradient(135deg, #ffcc00 0%, #ffd633 100%);
  margin-bottom: 1rem;
  color: #333;
}

.section-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: bold;
}

.section-header p {
  margin: 0;
  opacity: 0.8;
  font-size: 1rem;
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
  .section-header {
    padding: 1rem;
  }
  
  .section-header h2 {
    font-size: 1.4rem;
  }
  
  ion-col {
    padding: 8px;
  }
}
</style>
