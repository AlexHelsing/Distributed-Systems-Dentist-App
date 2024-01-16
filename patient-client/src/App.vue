<script setup lang="ts">
import { computed, watch } from 'vue';
import NavBar from './components/NavBar.vue';
import { useRoute } from 'vue-router';
import { subscribeToUpdates } from './lib/pusher';


import AppointmentCancelledDialog from './components/AppointmentCancelledDialog.vue';
import { useUserStore } from './stateStores/userStore';
const route = useRoute();
const showNavBar = computed(() => route.path !== '/auth');

const userStore = useUserStore();


watch(
  () => userStore.user,
  (user) => {
    if (user && user._id) {
      subscribeToUpdates(user._id);
    }
  },
  { immediate: true }
);




</script>
<template>
  <div class="min-h-screen flex flex-col text-gray-900 bg-gray-100 dark:bg-gray-900 dark:text-white">
    <NavBar v-if="showNavBar" />

    <router-view />



  </div>

  <AppointmentCancelledDialog />
</template>

<style scoped></style>
