<template>
    <Header></Header>
    <div class="flex h-screen flex-col md:flex-row flex-1 justify-center gap-6 bg-white  px-6 py-9 lg:px-8 lg:py-12">
        <div class="flex justify-center">
            <DatePicker  v-model="calendareDate"></DatePicker> 
        </div>
           
        <div class="flex flex-col w-full lg:w-1/2 bg-gray-100 rounded-md overflow-y-auto p-4">
            <div class="flex flex-row w-full justify-between">
                <h3 class="text-gray-900 justify-top mb-4">Appointments: {{ formattedDate }}</h3>
                <button @click="showModal = true" type="button" class=" rounded-md border-0 ring-1 text-sm font-semibold text-gray-900 ring-indigo-600 bg-indigo-300 hover:bg-indigo-500 p-1 m-1">Create +</button>
            </div>
            
            <div class="grid grid-cols-1 flex flex-wrap w-full gap-4 mt-4">
                <div v-for="appointment in sortedAppointments" class="grid grid-cols-3 flex flex-wrap items-center leading-6 gap-3 ring-1 ring-gray-500 text-gray-900 bg-gray-300 rounded-md px-2 py-1">
                    <p class="flex-shrink-0">time: {{ appointment?.startTime }} - {{ appointment?.endTime }}</p>
                    <p class="flex-shrink-0" v-if="appointment?.booked">status: booked</p>
                    <p class="flex-shrink-0" v-else>status: not booked</p>
                    <button v-if="appointment?.booked" @click="cancelAppointment(appointment._id)" type="button" class="justify-self-end text-sm font-semibold rounded-md border-0 ring-1 ring-red-700 bg-red-500 hover:bg-red-400 p-1">Cancel</button>
                </div>
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
                        <form class="p-4 md:p-5">
                            <div class="grid gap-4 mb-4 grid-cols-1">

                                <label for="Start time" class="block text-sm font-medium leading-6 text-gray-900">Start time</label>
                                
                                <div class="flex flex-row gap-6">
                                    <input v-model="startHour" id="Start time" type="number" required placeholder="hour" class="block h-9 bg-gray-300 w-full ring-1 ring-gray-500 rounded-md border-0 p-1.5 text-gray-900 shadow-sm focus:outline-none placeholder:text-gray-400 sm:text-sm">
                                    <input v-model="startMinute" id="Start time" type="number" required placeholder="minute" class="block h-9 bg-gray-300 w-full ring-1 ring-gray-500 rounded-md border-0 p-1.5 text-gray-900 shadow-sm focus:outline-none placeholder:text-gray-400 sm:text-sm">
                                </div>

                                <label for="End time" class="block text-sm font-medium leading-6 text-gray-900">End time</label>
                                
                                <div class="flex flex-row gap-6">
                                    <input v-model="endHour" id="End time" type="number" required placeholder="hour" class="block h-9 bg-gray-300 w-full ring-1 ring-gray-500 rounded-md border-0 p-1.5 text-gray-900 shadow-sm focus:outline-none placeholder:text-gray-400 sm:text-sm">
                                    <input v-model="endMinute" id="End time" type="number" required placeholder="minute" class="block h-9 bg-gray-300 w-full ring-1 ring-gray-500 rounded-md border-0 p-1.5 text-gray-900 shadow-sm focus:outline-none placeholder:text-gray-400 sm:text-sm">
                                </div>
                                
                                <div class="flex justify-center items-center">
                                    <button @click="createAppointment" type="button" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                       <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                                       Add new appointment
                                    </button>
                                </div>
                                
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    </div>
    
</template>



<script setup lang="ts">
import Header from '../components/Header.vue'
import { ref, onMounted, computed} from 'vue';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { API } from '../Api';
import { useRoute } from 'vue-router';
import { AxiosError } from 'axios';

interface Appointment {
  startTime: string;
  endTime: string;
  booked: boolean;
  date: string;
  _id: string;
  patientId: string;
  dentistId: string;
}

let calendareDate = ref(new Date());
let formattedDate = computed(() => {
    return calendareDate.value.toISOString().split('T')[0];
});

let showModal = ref(false);
let startHour = ref(0);
let startMinute = ref(0);
let endHour = ref(0);
let endMinute = ref(0);
const router = useRoute();
const dentist_id = router.params.dentist_id;
let allAppointments = ref<Appointment[]>([]);

let sortedAppointments = computed(() => {
    return allAppointments.value.filter((appointment: Appointment) => {
            return appointment.date === formattedDate.value;
    })
});

const cancelAppointment = async (appointment_id: string) => {
    try {
        const response = await API.delete(`/dentists/${dentist_id}/appointment_slots/${appointment_id}`, { headers: {"x-access-token":localStorage.getItem("x-access-token") } });
        
        if(response.status === 200) {
            alert(response.data.message);
            location.reload();
        }

    } catch (error: any) {
        const err = error as AxiosError<{ message: string }>;
        console.log(err.response?.status);
        alert(err.response?.data.message);
    }
};

const createAppointment = async () => {
    try {
        const start = `${String(startHour.value).padStart(2, '0')}:${String(startMinute.value).padStart(2, '0')}`;
        const end = `${String(endHour.value).padStart(2, '0')}:${String(endMinute.value).padStart(2, '0')}`;

        const requestBody = [{
            start,
            end,
            date: formattedDate.value,
        }];

        const response = await API.post(
            `/dentists/${dentist_id}/appointment_slots`,
            requestBody,
            { headers: {"x-access-token":localStorage.getItem("x-access-token") } }
        );

        if (response.status === 201) {
            alert('Appointment slot created successfully.');
            location.reload();
        }

        startHour.value = 0;
        startMinute.value = 0;
        endHour.value = 0;
        endMinute.value = 0;
        showModal.value = false;

    } catch (error: any) {
        const err = error as AxiosError<{ message: string }>;
        console.log(err.response?.status);
        alert(err.response?.data.message);
    }
};

onMounted(async () => {
  const response = await API.get(`/dentists/${dentist_id}/appointment_slots`);
  allAppointments.value = response.data;
});
</script>