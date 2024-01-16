<template>
    <div class="md:flex flex-1 border-t dark:border-none   md:overflow-auto md:flex-row flex-col ">

        <div
            class="md:w-[45%] flex flex-col  max-h-screen overflow-y-scroll scrollbar  scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-100 scrollbar-thumb-rounded-full  ">
            <div class="bg-white dark:bg-gray-800 flex flex-col px-5 py-7 space-y-6 z-10">
                <h1 class="text-2xl font-bold">Make an appointment </h1>

                <CitySearchInput :cities="swedishCities" :initialCity="city" />

                <div class="flex justify-between flex-wrap md:flex-nowrap gap-2 md:gap-0">
                    <button @click="getUserLocation" type="button"
                        class="z-[10] text-white bg-blue-700 hover:bg-blue-800 dark:bg-cyan-600 dark:hover:bg-cyan-700  focus:outline-none active:outline-none  rounded-xl font-semibold text-sm px-5 py-2.5 text-center me-2   inline-flex items-center">
                        <svg v-if="usingCurrentLocation" aria-hidden="true" role="status"
                            class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="#E5E7EB" />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentColor" />
                        </svg>
                        {{ usingCurrentLocation ? 'Using your location ' : 'Use my current location' }}
                    </button>

                    <AfternoonMorningToggle />

                </div>

            </div>


            <div class="py-4 px-2">
                <!-- <h1 class="text-lg font-bold py-1"> {{ dentistries.length }} results</h1> -->
                <div class="flex flex-col listofitems space-y-2 p-2 ">
                    <template v-if="isPending">
                        <DentistryCardSkeleton v-for="n in 5" :key="n" />
                    </template>
                    <template v-else-if="isError">
                        <div class="text-center text-md text-gray-500 max-w-[18rem] mx-auto line-clamp-3">
                            {{ error?.message }}
                        </div>
                    </template>
                    <template v-else>
                        <DentistryListItem :far-from-user="farFromUser(dentistry)" v-for="dentistry in data"
                            :key="dentistry._id" :dentistry="dentistry" @time-selected="handleTimeSelection" />
                    </template>
                </div>
            </div>
            <!-- <Paginator :rows="2" :totalRecords="dentistries.length" class="p-4   " /> -->
        </div>

        <div class="md:w-[65%] z-0   ">
            <DentistryMap :users-location="usersLocation" :using-current-location="usingCurrentLocation" :dentistries="data"
                :selectedCityCoordinates="selectedCityCoordinates" />
        </div>

    </div>

    <!-- Confirmation Bar -->
    <div v-if="showingConfirmationBar"
        class="fixed inset-x-0 bottom-0 md:flex-nowrap md:gap-0 gap-2 flex-wrap z-50 bg-white dark:bg-gray-900  shadow-black px-10 p-5 flex justify-between items-center shadow-2xl">
        <div class="flex items-center">
            <!-- Appointment Details -->
            <div class="flex items-center gap-4">
                <span class="text-md font-bold">
                    Appointment:
                    <span class="font-normal">
                        {{ bookingStore.bookingData?.dentistry.name }}
                    </span>
                </span>
                <!-- Divider -->
                <span class="border-l border-gray-300 h-6"></span>
                <span class="text-md text-gray-600 dark:text-gray-300">
                    {{ bookingStore.bookingData?.data.date }}
                </span>
                <!-- Divider -->
                <span class="border-l border-gray-300 h-6"></span>
                <span class="text-md text-gray-600 dark:text-gray-300">
                    {{ bookingStore.bookingData?.data.startTime }} - {{ bookingStore.bookingData?.data.endTime }}
                </span>
            </div>
        </div>

        <div class=" items-end md:justify-end flex gap-2">
            <!-- Cancel Button -->
            <button @click="showingConfirmationBar = false"
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-xl">
                Cancel
            </button>
            <!-- Continue Button -->
            <button @click="handleConfirmationButton"
                class="bg-blue-500 dark:bg-green-600 w-[20rem] hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl">
                Continue
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { swedishCities } from '../utils/swedishCities';
import { onMounted, onUnmounted, provide, ref, watch } from 'vue';

import CitySearchInput from '../components/CitySearchInput.vue';
import DentistryMap from '../components/DentistryMap.vue';
import 'primevue/resources/themes/lara-light-teal/theme.css';
import DentistryListItem from '../components/DentistryListItem.vue';
import 'leaflet/dist/leaflet.css';

import { useUserStore } from '../stateStores/userStore';
import router from '../router';
import { useBookingStore } from '../stateStores/bookingStore';
import axios from 'axios';
import { DENTIST_API } from '../utils/apiConfig';
import DentistryCardSkeleton from '../components/DentistryCardSkeleton.vue';
import { useRoute } from 'vue-router';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/vue-query';
import AfternoonMorningToggle from '@/components/AfternoonMorningToggle.vue';
import { subscribeToGlobalTimeslotUpdates, unsubscribeFromGlobalTimeslotUpdates } from '@/lib/pusher';
// city input is one of the sweedish cities in the array
const cityInput = ref('');

const bookingStore = useBookingStore();
const showingConfirmationBar = ref(false);


const route = useRoute();

const selectedCityCoordinates = ref({} as location);


const usersLocation = ref({} as location);
const usingCurrentLocation = ref(false);

const userStore = useUserStore();

provide('userStore', userStore);

const city = ref(route.query.city as string);



const { isPending, isError, data, error } = useQuery<Dentistry[]>({
    queryKey: ['clinics', city],
    queryFn: getClinics,
})

const queryClient = useQueryClient();

onMounted(() => {
    const handleTimeslotUpdate = () => {
        console.log('Timeslot updated in mappage');
        queryClient.invalidateQueries(['timeslots'] as InvalidateQueryFilters)
    };

    window.addEventListener('timeslot-updated', handleTimeslotUpdate);

    // Setup your pusher subscription
    subscribeToGlobalTimeslotUpdates();

    onUnmounted(() => {
        window.removeEventListener('timeslot-updated', handleTimeslotUpdate);
        unsubscribeFromGlobalTimeslotUpdates();
    });
});
watch(() => route.query.city, (cityName) => {

    if (cityName) {
        const city = swedishCities.find(c => c.name === cityName);
        if (city) {
            selectedCityCoordinates.value = city.coordinates;
            console.log("City selected:", cityName, "with coordinates" + city.coordinates.lat); // Debugging log
        } else {
            // Handle the case where the city is not found
            console.log("City not found:", cityName); // Debugging log

        }
    } else {
        // set it to gothenburg
        selectedCityCoordinates.value = { lat: 57.7089, lng: 11.9746 };
    }
}, { immediate: true });


watch(() => route.query.city, () => {
    // set the city input to the city in the route
    console.log(route.query.city);
    city.value = route.query.city as string;
}
);



async function getClinics() {
    // get city from param
    let city = route.query.city;

    if (!city) {
        city = '';
    }

    try {
        const response = await axios.get(`${DENTIST_API}/clinics/city?city=${city}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return response.data;

    } catch (error) {
        console.error('Error fetching clinics:', error);
    }
}



const getUserLocation = async () => {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        usersLocation.value = {
            lat: (position as GeolocationPosition).coords.latitude,
            lng: (position as GeolocationPosition).coords.longitude
        };

        // find the users city
        const usersCity = findUsersCity(usersLocation.value.lat, usersLocation.value.lng);
        // set the city input to the users city
        cityInput.value = usersCity.name;

        // set the route
        const currentQuery = router.currentRoute.value.query;
        router.push({ query: { ...currentQuery, city: usersCity.name } });

        usingCurrentLocation.value = true;
    } catch (error) {
        console.error("Error fetching user location:", error);
        // Handle error or fallback here
    }
};


// function to find the users city based on their location
function findUsersCity(lat: number, lng: number) {
    let closestCity = swedishCities[0];
    let closestDistance = Math.sqrt(Math.pow(lat - closestCity.coordinates.lat, 2) + Math.pow(lng - closestCity.coordinates.lng, 2));

    for (let i = 1; i < swedishCities.length; i++) {
        const city = swedishCities[i];
        const distance = Math.sqrt(Math.pow(lat - city.coordinates.lat, 2) + Math.pow(lng - city.coordinates.lng, 2));
        if (distance < closestDistance) {
            closestCity = city;
            closestDistance = distance;
        }
    }


    return closestCity;
}

function farFromUser(dentistry: Dentistry) {
    const dentistryLat = dentistry.coordinates.lat;
    const dentistryLng = dentistry.coordinates.lng;
    const userLat = usersLocation.value.lat;
    const userLng = usersLocation.value.lng;

    const distance = Math.sqrt(Math.pow(dentistryLat - userLat, 2) + Math.pow(dentistryLng - userLng, 2));
    //return the distance in km
    return (distance * 100);
}



function handleTimeSelection(data: unknown) {
    bookingStore.setBookingData(data as Booking);


    showingConfirmationBar.value = true;
}

function handleConfirmationButton() {
    // push to confirmation and send the data
    showingConfirmationBar.value = false;
    router.push({ name: 'Confirmation' });
}


// Function to sort by date
// function sortDentistriesByAvailableTimes(date: string) {
//     const sortedDentistries = dentistries.value;

//     // sort the dentistries, the first one will have the most available times on the selected date
//     sortedDentistries.sort((a, b) => {
//         // get the number of available times for the first dentistry
//         const aAvailableTimes = a.slots.filter((slot) => slot.date === date).length;
//         // get the number of available times for the second dentistry
//         const bAvailableTimes = b.slots.filter((slot) => slot.date === date).length;

//         // return the difference between the two numbers
//         return bAvailableTimes - aAvailableTimes;
//     });


//     return sortedDentistries;
// }




</script>

<style>
/* primevue force diff colors */
.dark .p-calendar .p-inputtext {
    background-color: rgb(55 65 81);
    color: #E5E5E5;
    border-color: #ff0000;
}

.dark .p-icon {
    color: #ffffff;
}

.p-calendar:focus .p-inputtext:focus {
    border-color: transparent;
    border: none;
    outline: none;
    box-shadow: none !important;
    ;
}

.p-calendar:not(.p-calendar-disabled).p-focus>.p-inputtext {
    border-color: transparent;
    border: none;
    outline: none;

    box-shadow: none !important;
    ;
}
</style>