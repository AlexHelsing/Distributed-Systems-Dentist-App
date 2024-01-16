<template>
    <div class="flex h-screen flex-1 flex-col justify-center bg-white px-6 py-9 lg:py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm md:max-w-xl">
            <div class="flex flex-row justify-center">
                <img class="mr-1 h-12 w-12" src="../assets/tooth.svg" alt="Your Company Logo" />
                <h2 class="text-2xl font-bold text-gray-900">Dentist App</h2>
            </div>
          
          <h2 v-if="isDentist" class="mt-10 text-center text-xl font-bold text-gray-900">Log in as a dentist</h2>
          <h2 v-if="isAdmin" class="mt-10 text-center text-xl font-bold text-gray-900">Log in as an admin</h2>
        </div>

        <div class="grid mt-10 sm:mx-auto sm:w-full sm:max-w-sm md:max-w-xl">
          <div  v-if="isDentist">
            <form class="space-y-6">
                <div>
                  <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                  <div class="mt-2">
                    <input v-model="dentistEmail" id="email" type="email" required class="block h-9 bg-gray-300 w-full ring-1 ring-gray-500 rounded-md border-0 p-1.5 text-gray-900 shadow-sm focus:outline-none placeholder:text-gray-400 sm:text-sm" />
                  </div>
                </div>

                <div>
                  <div class="flex items-center justify-between">
                    <label for="dentistPassword" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                  </div>
                  <div class="mt-2">
                    <input v-model="dentistPassword" id="dentistPassword" type="password" required class="block p-1.5 h-9 bg-gray-300 w-full ring-1 ring-gray-500 rounded-md border-0 text-gray-900 shadow-sm focus:outline-none placeholder:text-gray-40" />
                  </div>
                </div>

                <div>
                  <button type="button" @click="dentistLogin" class="flex h-9 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">Sign in</button>
                </div>
            </form>

            <div  v-if="isError" class="mt-3 inline-flex flex-col flex-wrap place-self-center place-items-center bg-red-200 rounded-lg border-2 border-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 w-full text-red-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p class="text-red-600 break-words font-semibold p-1.5">{{ errorMsg }}</p>
            </div>

            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-white text-gray-500">OR</span>
                </div>
            </div>

            <button @click="showAdmin" type="button" class="flex pb-1 h-9 w-full bg-white ring-1 ring-indigo-600 text-gray-900 w-full justify-center items-center shadow-sm rounded-md text-sm font-semibold hover:bg-indigo-50">Go to admin sign in</button>
          </div>
            
          <div v-if="isAdmin">
            <form class="space-y-6">
                <div>
                  <label for="adminUsername" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
                  <div class="mt-2">
                    <input v-model="adminUsername" id="adminUsername" type="text" required class="block h-9 bg-gray-300 w-full ring-1 ring-gray-500 rounded-md border-0 p-1.5 text-gray-900 shadow-sm focus:outline-none placeholder:text-gray-400 sm:text-sm" />
                  </div>
                </div>

                <div>
                  <div class="flex items-center justify-between">
                    <label for="adminPassword" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                  </div>
                  <div class="mt-2">
                    <input v-model="adminPassword" id="adminPassword" type="password" required class="block p-1.5 h-9 bg-gray-300 w-full ring-1 ring-gray-500 rounded-md border-0 text-gray-900 shadow-sm focus:outline-none placeholder:text-gray-40" />
                  </div>
                </div>

                <div>
                  <button type="button" @click="adminLogin" class="flex h-9 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">Sign in</button>
                </div>
            </form>

            <div  v-if="isError" class="mt-3 inline-flex flex-col flex-wrap place-self-center place-items-center bg-red-200 rounded-lg border-2 border-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 w-full text-red-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p class="text-red-600 break-words font-semibold p-1.5">{{ errorMsg }}</p>
            </div>

            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-white text-gray-500">OR</span>
                </div>
            </div>

            <button @click="showDentist" type="button" class="flex pb-1 h-9 w-full bg-white ring-1 ring-indigo-600 text-gray-900 w-full justify-center items-center shadow-sm rounded-md text-sm font-semibold hover:bg-indigo-50">Go to dentist sign in</button>
          </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { API } from '../Api';
import router from '../router';
import { AxiosError } from 'axios';

let dentistEmail = ref('');
let dentistPassword = ref('');
let adminUsername = ref('');
let adminPassword = ref('');
let errorMsg = ref('');
let isError = ref(false);
let isAdmin = ref(false);
let isDentist = ref(true);

const dentistLogin = async () => {
  try {
    const dentist = {
      email: dentistEmail.value,
      password: dentistPassword.value,
    };

    const response = await API.post('/dentists/login', dentist);

    if (response.status === 201) {
      localStorage.setItem('x-access-token', response.data.token);
      let dentist_id = response.data._id;
      console.log('Logged in successfully.');
      console.log(response);

      router.push({
       path:`/${dentist_id}/appointment_slots`,
      })
    }

    dentistEmail.value = '';
    dentistPassword.value = '';
    

  } catch (error: any) {
    const err = error as AxiosError<{ message: string }>;
    console.log(err.response?.status);
    isError.value = true;
    if (err.response != undefined) {
      errorMsg.value = err.response.data.message;
    }
  }
};

const adminLogin = async () => {
  try {
    const admin = {
      username: adminUsername.value,
      password: adminPassword.value,
    };

    const response = await API.post('/clinics/login_admin', admin);

    if (response.status === 201) {
      localStorage.setItem('x-access-token', response.data.token);
      let clinic_id = response.data.clinicId;
      console.log('Logged in successfully.');
      console.log(response);

      router.push({
       path:`/${clinic_id}/dentists`,
      })
    }

    adminUsername.value = '';
    adminPassword.value = '';
    

  } catch (error: any) {
    const err = error as AxiosError<{ message: string }>;
    console.log(err.response?.status);
    isError.value = true;
    if (err.response != undefined) {
      errorMsg.value = err.response.data.message;
    }
  }
}

const showDentist = () => {
  isAdmin.value = false;
  isDentist.value = true;
}

const showAdmin = () => {
  isAdmin.value = true;
  isDentist.value = false;
};
</script>


<style>

</style>