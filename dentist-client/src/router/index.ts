import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/login.vue';
import Appointments from '../views/Appointments.vue';
import Clinic from '../views/Clinic.vue'


const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/:dentist_id/appointment_slots',
    name: 'Appointments',
    component: Appointments,
  },
  {
    path: '/:id/dentists',
    name: 'Clinic',
    component: Clinic,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
