<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="vueling">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <div class="title-container">
            <ion-icon :icon="speedometerOutline" class="title-icon"></ion-icon>
            <span>KPIs SMART</span>
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
     

        <!-- Business SMART KPIs -->
        <div class="section-header business">
          <h2>Negocio</h2>
        </div>
        
        <ion-grid class="ion-no-padding">
          <ion-row class="ion-padding">
            <ion-col size="12" size-md="6" size-lg="4" class="ion-padding-horizontal ion-padding-bottom">
              <div class="smart-card business">
                <div class="smart-icon">
                  <ion-icon :icon="airplaneOutline"></ion-icon>
                </div>
                <div class="smart-content">
                  <div class="smart-title">Reservas Mensuales</div>
                  <div class="smart-metric">
                    <span class="current-value">{{ formatNumber(28400) }}</span>
                    <span class="target-value">/ {{ formatNumber(30000) }}</span>
                  </div>
                  <div class="smart-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" :style="{ width: '94.7%' }"></div>
                    </div>
                    <span class="progress-text">94.7% del objetivo</span>
                  </div>
                  <div class="smart-details">
                    <div class="detail-item">
                      <strong>S:</strong> Incrementar reservas mensuales
                    </div>
                    <div class="detail-item">
                      <strong>M:</strong> 30,000 reservas/mes
                    </div>
                    <div class="detail-item">
                      <strong>A:</strong> Basado en crecimiento histórico 12%
                    </div>
                    <div class="detail-item">
                      <strong>R:</strong> Impacta directamente en ingresos
                    </div>
                    <div class="detail-item">
                      <strong>T:</strong> Diciembre 2024
                    </div>
                  </div>
                </div>
              </div>
            </ion-col>

            <ion-col size="12" size-md="6" size-lg="4" class="ion-padding-horizontal ion-padding-bottom">
              <div class="smart-card business">
                <div class="smart-icon">
                  <ion-icon :icon="cashOutline"></ion-icon>
                </div>
                <div class="smart-content">
                  <div class="smart-title">ARPU (Ingreso por Usuario)</div>
                  <div class="smart-metric">
                    <span class="current-value">€175</span>
                    <span class="target-value">/ €180</span>
                  </div>
                  <div class="smart-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" :style="{ width: '97.2%' }"></div>
                    </div>
                    <span class="progress-text">97.2% del objetivo</span>
                  </div>
                  <div class="smart-details">
                    <div class="detail-item">
                      <strong>S:</strong> Aumentar ingreso promedio por usuario
                    </div>
                    <div class="detail-item">
                      <strong>M:</strong> €180 ARPU trimestral
                    </div>
                    <div class="detail-item">
                      <strong>A:</strong> Mediante upselling y servicios premium
                    </div>
                    <div class="detail-item">
                      <strong>R:</strong> Mejora rentabilidad por cliente
                    </div>
                    <div class="detail-item">
                      <strong>T:</strong> Q4 2024
                    </div>
                  </div>
                </div>
              </div>
            </ion-col>

            <ion-col size="12" size-md="6" size-lg="4" class="ion-padding-horizontal ion-padding-bottom">
              <div class="smart-card business">
                <div class="smart-icon">
                  <ion-icon :icon="funnelOutline"></ion-icon>
                </div>
                <div class="smart-content">
                  <div class="smart-title">Tasa de Conversión</div>
                  <div class="smart-metric">
                    <span class="current-value">15.2%</span>
                    <span class="target-value">/ 18%</span>
                  </div>
                  <div class="smart-progress">
                    <div class="progress-bar">
                      <div class="progress-fill warning" :style="{ width: '84.4%' }"></div>
                    </div>
                    <span class="progress-text">84.4% del objetivo</span>
                  </div>
                  <div class="smart-details">
                    <div class="detail-item">
                      <strong>S:</strong> Mejorar conversión visitante → reserva
                    </div>
                    <div class="detail-item">
                      <strong>M:</strong> 18% tasa de conversión
                    </div>
                    <div class="detail-item">
                      <strong>A:</strong> Optimización UX y checkout
                    </div>
                    <div class="detail-item">
                      <strong>R:</strong> Reduce coste de adquisición
                    </div>
                    <div class="detail-item">
                      <strong>T:</strong> Enero 2025
                    </div>
                  </div>
                </div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>

        <!-- Technical SMART KPIs -->
        <div class="section-header technical">
          <h2> Técnico</h2>
        </div>
        
        <ion-grid class="ion-no-padding">
          <ion-row class="ion-padding">
            <ion-col size="12" size-md="6" size-lg="4" class="ion-padding-horizontal ion-padding-bottom">
              <div class="smart-card technical">
                <div class="smart-icon">
                  <ion-icon :icon="speedometerOutline"></ion-icon>
                </div>
                <div class="smart-content">
                  <div class="smart-title">Latencia Promedio API</div>
                  <div class="smart-metric">
                    <span class="current-value">142ms</span>
                    <span class="target-value">/ 120ms</span>
                  </div>
                  <div class="smart-progress">
                    <div class="progress-bar">
                      <div class="progress-fill danger" :style="{ width: '118%' }"></div>
                    </div>
                    <span class="progress-text">118% - Excede objetivo</span>
                  </div>
                  <div class="smart-details">
                    <div class="detail-item">
                      <strong>S:</strong> Reducir latencia de APIs críticas
                    </div>
                    <div class="detail-item">
                      <strong>M:</strong> < 120ms promedio
                    </div>
                    <div class="detail-item">
                      <strong>A:</strong> Optimización de consultas y cache
                    </div>
                    <div class="detail-item">
                      <strong>R:</strong> Mejora experiencia usuario
                    </div>
                    <div class="detail-item">
                      <strong>T:</strong> Febrero 2025
                    </div>
                  </div>
                </div>
              </div>
            </ion-col>

            <ion-col size="12" size-md="6" size-lg="4" class="ion-padding-horizontal ion-padding-bottom">
              <div class="smart-card technical">
                <div class="smart-icon">
                  <ion-icon :icon="peopleOutline"></ion-icon>
                </div>
                <div class="smart-content">
                  <div class="smart-title">Ratio DAU/MAU</div>
                  <div class="smart-metric">
                    <span class="current-value">0.198</span>
                    <span class="target-value">/ 0.220</span>
                  </div>
                  <div class="smart-progress">
                    <div class="progress-bar">
                      <div class="progress-fill warning" :style="{ width: '90%' }"></div>
                    </div>
                    <span class="progress-text">90% del objetivo</span>
                  </div>
                  <div class="smart-details">
                    <div class="detail-item">
                      <strong>S:</strong> Aumentar engagement de usuarios
                    </div>
                    <div class="detail-item">
                      <strong>M:</strong> Ratio DAU/MAU > 0.22
                    </div>
                    <div class="detail-item">
                      <strong>A:</strong> Notificaciones push y gamificación
                    </div>
                    <div class="detail-item">
                      <strong>R:</strong> Indica retención y valor de vida
                    </div>
                    <div class="detail-item">
                      <strong>T:</strong> Marzo 2025
                    </div>
                  </div>
                </div>
              </div>
            </ion-col>

            <ion-col size="12" size-md="6" size-lg="4" class="ion-padding-horizontal ion-padding-bottom">
              <div class="smart-card technical">
                <div class="smart-icon">
                  <ion-icon :icon="bugOutline"></ion-icon>
                </div>
                <div class="smart-content">
                  <div class="smart-title">Crash Rate</div>
                  <div class="smart-metric">
                    <span class="current-value">0.4%</span>
                    <span class="target-value">/ 0.5%</span>
                  </div>
                  <div class="smart-progress">
                    <div class="progress-bar">
                      <div class="progress-fill success" :style="{ width: '80%' }"></div>
                    </div>
                    <span class="progress-text">Objetivo superado ✓</span>
                  </div>
                  <div class="smart-details">
                    <div class="detail-item">
                      <strong>S:</strong> Mantener crash rate bajo
                    </div>
                    <div class="detail-item">
                      <strong>M:</strong> < 0.5% crash rate
                    </div>
                    <div class="detail-item">
                      <strong>A:</strong> Testing automatizado y QA
                    </div>
                    <div class="detail-item">
                      <strong>R:</strong> Garantiza estabilidad de la app
                    </div>
                    <div class="detail-item">
                      <strong>T:</strong> Continuo
                    </div>
                  </div>
                </div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>

        <!-- Summary Section -->
        <div class="summary-section">
          <h3>Resumen Ejecutivo</h3>
          <div class="summary-grid">
            <div class="summary-item success">
              <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
              <span>3 KPIs en objetivo</span>
            </div>
            <div class="summary-item warning">
              <ion-icon :icon="warningOutline"></ion-icon>
              <span>2 KPIs cerca del objetivo</span>
            </div>
            <div class="summary-item danger">
              <ion-icon :icon="closeCircleOutline"></ion-icon>
              <span>1 KPI requiere atención</span>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, 
  IonButtons, IonButton, IonIcon, IonMenuButton 
} from '@ionic/vue';
import { 
  notificationsOutline, personCircleOutline, speedometerOutline, airplaneOutline,
  cashOutline, peopleOutline, funnelOutline, bugOutline, checkmarkCircleOutline,
  warningOutline, closeCircleOutline
} from 'ionicons/icons';

// KPI Data
const totalBookings = ref(24567);
const totalRevenue = ref(3420000);
const activeUsers = ref(89234);
const averageLoadTime = ref(342);

// Utility functions
const formatNumber = (num) => {
  return new Intl.NumberFormat('es-ES').format(num);
};

const formatCurrency = (num) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};
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

.smart-header {
  text-align: center;
  padding: 3rem 1rem 2rem;
  background: linear-gradient(135deg, #ffcc00 0%, #ffd633 100%);
  color: #333;
}

.smart-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: bold;
}

.smart-header p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.8;
}

.smart-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border-left: 6px solid;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}

.smart-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.smart-card.business {
  border-left-color: #ffcc00;
}

.smart-card.technical {
  border-left-color: #54a0ff;
}

.smart-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  margin-bottom: 1.5rem;
}

.smart-card.business .smart-icon {
  background: linear-gradient(135deg, #ffcc00, #ffd633);
}

.smart-card.technical .smart-icon {
  background: linear-gradient(135deg, #54a0ff, #74b9ff);
}

.smart-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.smart-metric {
  margin-bottom: 1.5rem;
}

.current-value {
  font-size: 3rem;
  font-weight: bold;
  color: #333;
}

.target-value {
  font-size: 1.5rem;
  color: #666;
  margin-left: 0.5rem;
}

.smart-progress {
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background-color: #e9ecef;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1dd1a1, #10ac84);
  border-radius: 6px;
  transition: width 0.3s ease;
}

.progress-fill.warning {
  background: linear-gradient(90deg, #feca57, #ff9f43);
}

.progress-fill.danger {
  background: linear-gradient(90deg, #ff6b6b, #ff5252);
}

.progress-text {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.smart-details {
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
}

.detail-item {
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

.detail-item strong {
  color: #333;
  font-weight: bold;
  margin-right: 0.5rem;
}

.summary-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.summary-section h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: #333;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
}

.summary-item.success {
  background-color: rgba(29, 209, 161, 0.1);
  color: #10ac84;
}

.summary-item.warning {
  background-color: rgba(255, 159, 67, 0.1);
  color: #ff9f43;
}

.summary-item.danger {
  background-color: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

.summary-item ion-icon {
  font-size: 1.5rem;
}

.kpi-summary {
  background: linear-gradient(135deg, #ffcc00 0%, #ffd633 100%);
  padding: 2rem 0;
  margin-bottom: 1rem;
}

.kpi-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left: 4px solid;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.kpi-card.primary {
  border-left-color: #ffcc00;
}

.kpi-card.success {
  border-left-color: #10ac84;
}

.kpi-card.warning {
  border-left-color: #ff9f43;
}

.kpi-card.info {
  border-left-color: #54a0ff;
}

.kpi-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
}

.kpi-card.primary .kpi-icon {
  background: linear-gradient(135deg, #ffcc00, #ffd633);
}

.kpi-card.success .kpi-icon {
  background: linear-gradient(135deg, #10ac84, #1dd1a1);
}

.kpi-card.warning .kpi-icon {
  background: linear-gradient(135deg, #ff9f43, #feca57);
}

.kpi-card.info .kpi-icon {
  background: linear-gradient(135deg, #54a0ff, #74b9ff);
}

.kpi-content {
  flex: 1;
}

.kpi-value {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.kpi-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.kpi-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.kpi-change.positive {
  color: #10ac84;
}

.kpi-change.negative {
  color: #ff6b6b;
}

.kpi-change ion-icon {
  font-size: 1rem;
}

.section-header {
  text-align: center;
  padding: 2rem 1rem 1rem;
  margin-bottom: 1rem;
  color: #333;
}

.section-header.business {
  background: linear-gradient(135deg, #ffcc00 0%, #ffd633 100%);
}

.section-header.technical {
  background: linear-gradient(135deg, #54a0ff 0%, #74b9ff 100%);
  color: white;
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
  .kpi-summary {
    padding: 1rem 0;
  }
  
  .kpi-card {
    padding: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .kpi-value {
    font-size: 1.5rem;
  }
  
  .kpi-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
  
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
