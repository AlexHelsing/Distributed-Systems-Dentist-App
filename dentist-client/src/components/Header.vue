<template>
  <header class="bg-gray-800 p-4 flex items-center justify-between">
    <div class="flex items-center">
      <img src="../assets/tooth.svg" alt="Logo" class="h-8 w-8 mr-2">
      <span class="text-white text-lg font-semibold">Dentist App</span>
    </div>

    <button @click="logout" class="text-white">Log out</button>
  </header>
</template>

<script setup lang="ts">
import router from '../router';

const logout = async () => {
  localStorage.removeItem('x-access-token')
  router.push({
    name: 'Login'
  })
};
</script>

<style scoped>

</style>