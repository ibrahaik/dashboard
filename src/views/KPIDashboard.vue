<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="vueling">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <div class="title-container">
            <span>KPIs</span>
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
            <ion-col size="12" class="ion-padding-horizontal ion-padding-bottom">
              <div class="coming-soon">
                <ion-icon :icon="speedometerOutline" class="coming-soon-icon"></ion-icon>
                <h2>Panel de KPIs en desarrollo</h2>
                <p>Esta sección estará disponible próximamente</p>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonMenuButton } from '@ionic/vue';
import { notificationsOutline, personCircleOutline, speedometerOutline } from 'ionicons/icons';
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

.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 70vh;
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-top: 3px solid #ffcc00;
}

.coming-soon-icon {
  font-size: 5rem;
  color: #ffcc00;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

p {
  color: #666;
  font-size: 1rem;
}
</style>
