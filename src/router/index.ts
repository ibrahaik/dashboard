import { createRouter, createWebHistory } from "@ionic/vue-router"
import type { RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    component: () => import("../views/Dashboard.vue"),
  },
  {
    path: "/tecnico",
    component: () => import("../views/TechnicalDashboard.vue"),
  },

  {
    path: "/objetivos",
    component: () => import("../views/SmartObjectives.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
