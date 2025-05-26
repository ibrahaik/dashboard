<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="vueling">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <div class="title-container">
            <ion-icon :icon="trophyOutline" class="title-icon"></ion-icon>
            <span>Objetivos SMART</span>
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
      <div class="objectives-container">
      

        <!-- Business Objectives Section -->
        <div class="section-header business">
          <h2>Objetivos de Negocio</h2>
        </div>

        <div class="objectives-table-container">
          <ion-card class="table-card">
            <ion-card-content>
              <div class="table-responsive">
                <table class="smart-table">
                  <thead>
                    <tr>
                      <th>KPI</th>
                      <th>Específico</th>
                      <th>Medible</th>
                      <th>Alcanzable</th>
                      <th>Relevante</th>
                      <th>Temporal</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="objective in businessObjectives" :key="objective.id" :class="objective.status">
                      <td class="kpi-cell">
                        <div class="kpi-info">
                          <ion-icon :icon="objective.icon"></ion-icon>
                          <span>{{ objective.kpi }}</span>
                        </div>
                      </td>
                      <td>{{ objective.specific }}</td>
                      <td>{{ objective.measurable }}</td>
                      <td>{{ objective.achievable }}</td>
                      <td>{{ objective.relevant }}</td>
                      <td>{{ objective.timebound }}</td>
                      <td>
                        <div class="status-badge" :class="objective.status">
                          <ion-icon :icon="getStatusIcon(objective.status)"></ion-icon>
                          {{ getStatusText(objective.status) }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ion-card-content>
          </ion-card>
        </div>

        <!-- Technical Objectives Section -->
        <div class="section-header technical">
          <h2> Objetivos Técnicos </h2>
        </div>

        <div class="objectives-table-container">
          <ion-card class="table-card">
            <ion-card-content>
              <div class="table-responsive">
                <table class="smart-table">
                  <thead>
                    <tr>
                      <th>KPI</th>
                      <th>Específico</th>
                      <th>Medible</th>
                      <th>Alcanzable</th>
                      <th>Relevante</th>
                      <th>Temporal</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="objective in technicalObjectives" :key="objective.id" :class="objective.status">
                      <td class="kpi-cell">
                        <div class="kpi-info">
                          <ion-icon :icon="objective.icon"></ion-icon>
                          <span>{{ objective.kpi }}</span>
                        </div>
                      </td>
                      <td>{{ objective.specific }}</td>
                      <td>{{ objective.measurable }}</td>
                      <td>{{ objective.achievable }}</td>
                      <td>{{ objective.relevant }}</td>
                      <td>{{ objective.timebound }}</td>
                      <td>
                        <div class="status-badge" :class="objective.status">
                          <ion-icon :icon="getStatusIcon(objective.status)"></ion-icon>
                          {{ getStatusText(objective.status) }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ion-card-content>
          </ion-card>
        </div>

      


        <!-- Summary Section -->
        <div class="summary-section">
          <h3>📋 Resumen de Objetivos</h3>
          <div class="summary-stats">
            <div class="stat-item success">
              <div class="stat-number">{{ completedObjectives }}</div>
              <div class="stat-label">Completados</div>
            </div>
            <div class="stat-item warning">
              <div class="stat-number">{{ inProgressObjectives }}</div>
              <div class="stat-label">En Progreso</div>
            </div>
            <div class="stat-item danger">
              <div class="stat-number">{{ pendingObjectives }}</div>
              <div class="stat-label">Pendientes</div>
            </div>
            <div class="stat-item info">
              <div class="stat-number">{{ Math.round((completedObjectives / totalObjectives) * 100) }}%</div>
              <div class="stat-label">Completitud</div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
  IonButtons, IonButton, IonIcon, IonMenuButton 
} from '@ionic/vue';
import { 
  notificationsOutline, personCircleOutline, trophyOutline, airplaneOutline,
  cashOutline, funnelOutline, heartOutline, trendingUpOutline, speedometerOutline,
  peopleOutline, bugOutline, phonePortraitOutline, codeSlashOutline,
  checkmarkCircleOutline, timeOutline, warningOutline
} from 'ionicons/icons';

// Business Objectives Data
const businessObjectives = ref([
  {
    id: 1,
    kpi: 'Reservas Mensuales',
    icon: airplaneOutline,
    specific: 'Incrementar reservas mensuales de vuelos',
    measurable: '30,000 reservas/mes',
    achievable: 'Campañas marketing digital + optimización SEO',
    relevant: 'Impacto directo en ingresos y cuota de mercado',
    timebound: 'Diciembre 2024',
    status: 'in-progress'
  },
  {
    id: 2,
    kpi: 'ARPU',
    icon: cashOutline,
    specific: 'Aumentar ingreso promedio por usuario',
    measurable: '€180 por usuario/trimestre',
    achievable: 'Upselling servicios premium y asientos',
    relevant: 'Mejora rentabilidad por cliente',
    timebound: 'Q1 2025',
    status: 'in-progress'
  },
  {
    id: 3,
    kpi: 'Tasa Conversión',
    icon: funnelOutline,
    specific: 'Mejorar conversión visitante → reserva',
    measurable: '18% tasa de conversión',
    achievable: 'Optimización UX y proceso checkout',
    relevant: 'Reduce coste adquisición cliente',
    timebound: 'Febrero 2025',
    status: 'pending'
  },
  {
    id: 4,
    kpi: 'Satisfacción Cliente',
    icon: heartOutline,
    specific: 'Incrementar satisfacción del cliente',
    measurable: 'NPS > 70 puntos',
    achievable: 'Mejora atención cliente y servicios',
    relevant: 'Fidelización y recomendaciones',
    timebound: 'Junio 2025',
    status: 'pending'
  },
  {
    id: 5,
    kpi: 'Cuota Mercado',
    icon: trendingUpOutline,
    specific: 'Aumentar cuota de mercado nacional',
    measurable: '25% cuota mercado España',
    achievable: 'Expansión rutas + alianzas estratégicas',
    relevant: 'Posicionamiento competitivo',
    timebound: 'Diciembre 2025',
    status: 'pending'
  }
]);

// Technical Objectives Data
const technicalObjectives = ref([
  {
    id: 6,
    kpi: 'Latencia API',
    icon: speedometerOutline,
    specific: 'Reducir latencia APIs críticas',
    measurable: '< 120ms promedio',
    achievable: 'Optimización consultas + cache Redis',
    relevant: 'Mejora experiencia usuario',
    timebound: 'Enero 2025',
    status: 'pending'
  },
  {
    id: 7,
    kpi: 'Usuarios Activos Diarios',
    icon: peopleOutline,
    specific: 'Aumentar engagement usuarios diarios',
    measurable: '95,000 DAU promedio',
    achievable: 'Notificaciones push + gamificación',
    relevant: 'Indica retención y valor vida cliente',
    timebound: 'Marzo 2025',
    status: 'in-progress'
  },
  {
    id: 8,
    kpi: 'Crash Rate',
    icon: bugOutline,
    specific: 'Mantener estabilidad aplicación',
    measurable: '< 0.5% crash rate',
    achievable: 'Testing automatizado + QA continuo',
    relevant: 'Garantiza experiencia sin interrupciones',
    timebound: 'Continuo',
    status: 'completed'
  },
  {
    id: 9,
    kpi: 'Tiempo Carga App',
    icon: phonePortraitOutline,
    specific: 'Optimizar tiempo carga inicial',
    measurable: '< 2.5s tiempo carga',
    achievable: 'Lazy loading + optimización assets',
    relevant: 'Reduce abandono en primera visita',
    timebound: 'Abril 2025',
    status: 'pending'
  },
  {
    id: 10,
    kpi: 'Cobertura Testing',
    icon: codeSlashOutline,
    specific: 'Aumentar cobertura tests automatizados',
    measurable: '> 85% cobertura código',
    achievable: 'Tests unitarios + integración CI/CD',
    relevant: 'Reduce bugs en producción',
    timebound: 'Mayo 2025',
    status: 'in-progress'
  }
]);

// Computed properties for summary
const totalObjectives = computed(() => businessObjectives.value.length + technicalObjectives.value.length);
const completedObjectives = computed(() => {
  const business = businessObjectives.value.filter(obj => obj.status === 'completed').length;
  const technical = technicalObjectives.value.filter(obj => obj.status === 'completed').length;
  return business + technical;
});
const inProgressObjectives = computed(() => {
  const business = businessObjectives.value.filter(obj => obj.status === 'in-progress').length;
  const technical = technicalObjectives.value.filter(obj => obj.status === 'in-progress').length;
  return business + technical;
});
const pendingObjectives = computed(() => {
  const business = businessObjectives.value.filter(obj => obj.status === 'pending').length;
  const technical = technicalObjectives.value.filter(obj => obj.status === 'pending').length;
  return business + technical;
});

// Helper functions
const getStatusIcon = (status) => {
  switch (status) {
    case 'completed': return checkmarkCircleOutline;
    case 'in-progress': return timeOutline;
    case 'pending': return warningOutline;
    default: return warningOutline;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'completed': return 'Completado';
    case 'in-progress': return 'En Progreso';
    case 'pending': return 'Pendiente';
    default: return 'Pendiente';
  }
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

.objectives-container {
  max-width: 1600px;
  margin: 0 auto;
}

.objectives-header {
  text-align: center;
  padding: 3rem 1rem 2rem;
  background: linear-gradient(135deg, #ffcc00 0%, #ffd633 100%);
  color: #333;
}

.objectives-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: bold;
}

.objectives-header p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.8;
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

.section-header.custom {
  background: linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%);
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

.objectives-table-container {
  margin: 0 1rem 2rem;
}

.table-card {
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
}

.smart-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.smart-table th {
  background: linear-gradient(135deg, #333, #555);
  color: white;
  padding: 1rem 0.75rem;
  text-align: left;
  font-weight: bold;
  font-size: 0.85rem;
  white-space: nowrap;
}

.smart-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #e9ecef;
  vertical-align: top;
  line-height: 1.4;
}

.smart-table tr:hover {
  background-color: rgba(255, 204, 0, 0.05);
}

.smart-table tr.completed {
  background-color: rgba(29, 209, 161, 0.05);
}

.smart-table tr.in-progress {
  background-color: rgba(255, 159, 67, 0.05);
}

.smart-table tr.pending {
  background-color: rgba(255, 107, 107, 0.05);
}

.kpi-cell {
  min-width: 150px;
}

.kpi-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  color: #333;
}

.kpi-info ion-icon {
  font-size: 1.2rem;
  color: #ffcc00;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  white-space: nowrap;
}

.status-badge.completed {
  background-color: rgba(29, 209, 161, 0.2);
  color: #10ac84;
}

.status-badge.in-progress {
  background-color: rgba(255, 159, 67, 0.2);
  color: #ff9f43;
}

.status-badge.pending {
  background-color: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

.chart-section {
  margin: 0 1rem 2rem;
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

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  padding: 1.5rem 1rem;
  border-radius: 16px;
  text-align: center;
}

.stat-item.success {
  background: linear-gradient(135deg, rgba(29, 209, 161, 0.1), rgba(16, 172, 132, 0.1));
  border: 2px solid rgba(29, 209, 161, 0.3);
}

.stat-item.warning {
  background: linear-gradient(135deg, rgba(255, 159, 67, 0.1), rgba(254, 202, 87, 0.1));
  border: 2px solid rgba(255, 159, 67, 0.3);
}

.stat-item.danger {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 82, 82, 0.1));
  border: 2px solid rgba(255, 107, 107, 0.3);
}

.stat-item.info {
  background: linear-gradient(135deg, rgba(84, 160, 255, 0.1), rgba(116, 185, 255, 0.1));
  border: 2px solid rgba(84, 160, 255, 0.3);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-item.success .stat-number {
  color: #10ac84;
}

.stat-item.warning .stat-number {
  color: #ff9f43;
}

.stat-item.danger .stat-number {
  color: #ff6b6b;
}

.stat-item.info .stat-number {
  color: #54a0ff;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

@media (max-width: 768px) {
  .objectives-header {
    padding: 2rem 1rem 1rem;
  }
  
  .objectives-header h1 {
    font-size: 2rem;
  }
  
  .section-header {
    padding: 1rem;
  }
  
  .section-header h2 {
    font-size: 1.4rem;
  }
  
  .smart-table {
    font-size: 0.8rem;
  }
  
  .smart-table th,
  .smart-table td {
    padding: 0.75rem 0.5rem;
  }
  
  .summary-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-number {
    font-size: 2rem;
  }
}
</style>
