<template>
    <div class="flex flex-col md:flex-row w-full items-center gap-5 md:gap-10 z-[100] ">
        <div class="relative flex-grow w-full md:w-3/5 ">
            <input @input="showDropdown = true" type="text" v-model="cityInput" placeholder="Search by city..."
                class="w-full pl-3 pr-10 py-3 border border-gray-300 dark:border-gray-900 rounded-t-md focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:focus:border-cyan-900" />
            <MagnifyingGlassIcon
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 dark:text-gray-200" />

            <div v-if="cityInput"
                class="absolute w-full bg-white dark:bg-gray-600 border dark:border-cyan-900 scrollbar  rounded-b-md  max-h-60 overflow-auto">
                <div v-if="showDropdown" v-for="city in filterCities()" :key="city.name" @click="selectCity(city.name)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    {{ city.name }}
                </div>
            </div>
        </div>



        <Calendar v-model="DateInput" v-on:date-select="handleDateSelection" dateFormat="yy-mm-dd"
            class="md:w-2/5 w-full pl-3   py-3 border  border-gray-300 rounded-md active:outline-none focus:outline-none dark:border-gray-900 dark:bg-gray-700 dark:text-gray-900"
            :show-icon="true" placeholder="Date" />


    </div>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue';
import Calendar from 'primevue/calendar';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { swedishCities } from '@/utils/swedishCities';
import router from '@/router';
const DateInput = ref('');

const props = defineProps({
    cities: Array,
    initialCity: String,
});

const cityInput = ref(props.initialCity || '');
const showDropdown = ref(false);

function filterCities() {
    if (!cityInput.value) {
        return [];
    }

    return swedishCities.filter(city =>
        city.name.toLowerCase().includes(cityInput.value.toLowerCase())
    );
}



const selectCity = (cityName: string) => {


    const currentQuery = router.currentRoute.value.query;

    router.push({ query: { ...currentQuery, city: cityName } });

    /// close the dropdown
    showDropdown.value = false;
};

watch(() => props.initialCity, (newCity) => {
    cityInput.value = newCity ?? '';
}, { immediate: true });

// get inital date from params
watch(() => router.currentRoute.value.query.date, (newDate) => {
    DateInput.value = newDate as string;
}, { immediate: true });

function handleDateSelection() {
    if (!DateInput.value) return;
    const date = DateInput.value ? new Date(DateInput.value).toLocaleDateString('sv-SE') : '';
    console.log(date);


    const currentQuery = router.currentRoute.value.query;
    router.push({ query: { ...currentQuery, date: date } });
}

</script>