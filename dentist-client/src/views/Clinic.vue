<template>
  <div class="bg-white h-screen overflow-y-auto">
    <Header></Header>

    <div class="p-3 flex items-center justify-between">
      <h1 class="text-gray-900 text-2xl font-bold mb-4">Dentist Management</h1>

      <button @click="showModal = true" type="button" class="bg-blue-700 text-white py-2 px-4 rounded-md">Create Dentist</button>
    </div>
    <!-- Main modal -->
    <div v-show="showModal" class="overflow-y-auto absolute inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-50">
                <div class="relative p-4 w-full max-w-md max-h-full">
                    <!-- Modal content -->
                    <div class="relative bg-white rounded-lg shadow">
                        <!-- Modal header -->
                        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                            <h3 class="text-lg font-semibold text-gray-900">Create new appointment</h3>
                            <button @click="showModal = false" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <!-- Modal body -->
                        <!-- Create Dentist Form -->
                        <form @submit.prevent="createDentist">
                          <div class="p-4 grid gap-4 mb-4 grid-cols-1">
                            <label class="text-gray-900" for="firstName">First Name:</label>
                            <input v-model="newDentist.firstName" type="text" id="firstName" required class="mb-2 p-2 bg-gray-300 ring-1 ring-gray-500 rounded-md border-0 p-1.5 text-gray-900 shadow-sm focus:outline-none placeholder:text-gray-400 sm:text-sm" />
                            
                            <label class="text-gray-900" for="lastName">Last Name:</label>
                            <input v-model="newDentist.lastName" type="text" id="lastName" required class="mb-2 p-2 bg-gray-300 ring-1 ring-gray-500 rounded-md border-0 p-1.5 text-gray-900 shadow-sm focus:outline-none placeholder:text-gray-400 sm:text-sm" />
                            
                            <label class="text-gray-900" for="email">Email:</label>
                            <input v-model="newDentist.email" type="email" id="email" required class="mb-2 p-2 bg-gray-300 ring-1 ring-gray-500 rounded-md border-0 p-1.5 text-gray-900 shadow-sm focus:outline-none placeholder:text-gray-400 sm:text-sm" />
                            
                            <label class="text-gray-900" for="phone">Phone Number:</label>
                            <input v-model="newDentist.phone_number" type="tel" id="phone" required class="mb-2 p-2 bg-gray-300 ring-1 ring-gray-500 rounded-md border-0 p-1.5 text-gray-900 shadow-sm focus:outline-none placeholder:text-gray-400 sm:text-sm" />
                            
                            <label class="text-gray-900" for="password">Password:</label>
                            <input v-model="newDentist.password" type="password" id="password" required class="mb-2 p-2 bg-gray-300 ring-1 ring-gray-500 rounded-md border-0 p-1.5 text-gray-900 shadow-sm focus:outline-none placeholder:text-gray-400 sm:text-sm" />
                            
                            <label class="text-gray-900" for="dob">Date of Birth:</label>
                            <input v-model="newDentist.DOB" type="date" id="dob" required class="mb-2 p-2 bg-gray-300 ring-1 ring-gray-500 rounded-md border-0 p-1.5 text-gray-900 shadow-sm focus:outline-none placeholder:text-gray-400 sm:text-sm" />
                            
                            <div class="flex justify-center items-center">
                              <button type="submit" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                submit
                              </button>
                            </div>

                          </div>
                        </form>

                    </div>
                </div>
            </div>
    

    

    <!-- Dentist List -->
    <ul>
      <li v-for="dentist in dentists" :key="dentist._id" class="mb-4 p-4 text-gray-900 border border-gray-300 rounded-md">
        <p>{{ dentist.firstName }} {{ dentist.lastName }}</p>
        <p>Email: {{ dentist.email }}</p>
        <p>Phone: {{ dentist.phone_number }}</p>
        <p>Date of Birth: {{ dentist.DOB }}</p>
        <button @click="deleteDentist(dentist._id)" class="mt-2 bg-red-500 text-white py-1 px-2 rounded-md">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Header from '../components/Header.vue'
import { API } from '../Api';
import { useRoute } from 'vue-router';
import { AxiosError } from 'axios';

let showModal = ref(false);
const router = useRoute();
const clinic_id = router.params.id;

// Sample data for dentists
const dentists = ref([
  {
    _id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone_number: '1234567890',
    password: 'password123',
    DOB: '1990-01-01',
  },
]);

const newDentist = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone_number: '',
  password: '',
  DOB: '',
});

// Function to create a new dentist
const createDentist = async () => {
  try {
      const requestBody = {
        firstname: newDentist.value.firstName,
        lastname: newDentist.value.lastName,
        email: newDentist.value.email,
        phone_number: newDentist.value.phone_number,
        password: newDentist.value.password,
        DOB: newDentist.value.DOB,
      }

      const response = await API.post(
        `clinics/${clinic_id}/dentists`,
        requestBody,
        { headers: {"x-access-token":localStorage.getItem("x-access-token") } }
      );

      if (response.status === 201) {
        alert('new dentist added successfully.');
        location.reload();     
      }

      newDentist.value.firstName = ''
      newDentist.value.lastName = ''
      newDentist.value.email = ''
      newDentist.value.password = ''
      newDentist.value.DOB = ''
      newDentist.value.phone_number = ''
      showModal.value = false

  } catch (error: any) {
        const err = error as AxiosError<{ message: string }>;
        console.log(err.response?.status);
        alert(err.response?.data.message);
    }
};

// Function to delete a dentist
const deleteDentist = async (dentistId: number) => {
  // Send a request to your backend API to delete the dentist with the specified ID
  // and remove the dentist from the dentists array on success.
  // For simplicity, we'll filter out the dentist with the specified ID.
  try {
    const response = await API.delete(`/clinics/${clinic_id}/dentists/${dentistId}`, { headers: {"x-access-token":localStorage.getItem("x-access-token") } })

    if(response.status === 200) {
      alert(response.data.message)
      location.reload();
    }

  } catch (error: any) {
        const err = error as AxiosError<{ message: string }>;
        console.log(err.response?.status);
        alert(err.response?.data.message);
    }

};

onMounted(async () => {
  const response = await API.get(`/clinics/${clinic_id}`);
  dentists.value = response.data.dentists;
});
</script>

<style scoped>

</style>

  