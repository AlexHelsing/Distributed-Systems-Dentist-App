import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  MdKeyboardarrowleft,
  MdKeyboardarrowright,
  IoLocation,
  BiCalendarCheck,
  FaLocationArrow,
} from 'oh-vue-icons/icons';
import { VueQueryPlugin } from '@tanstack/vue-query';

addIcons(
  MdKeyboardarrowright,
  MdKeyboardarrowleft,
  IoLocation,
  BiCalendarCheck,
  FaLocationArrow
);

const app = createApp(App);
app.use(VueQueryPlugin);
app.use(router);
app.use(createPinia());
app.use(PrimeVue, {
  ripple: true,
});
app.component('v-icon', OhVueIcon);
app.mount('#app');
