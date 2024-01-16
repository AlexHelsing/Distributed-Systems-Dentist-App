<template>
    <div v-if="isPending" class=" w-[20rem] h-full flex justify-center items-center">
        <div class="rounded-md h-12 w-12 border-4 border-t-4 dark:border-slate-200 border-cyan-600 animate-spin "></div>
    </div>
    <div v-else-if="isError" class="">error</div>
    <div v-else class="flex flex-col h-full  ">
        <div class="flex  flex-col space-y-4">
            <!-- Calendar Navigation -->
            <div class="flex items-center justify-between px-4 gap-7">
                <button @click="navigate(-5)" :disabled="isEarliestWeek"
                    class="cursor-pointer border rounded-full  items-center"
                    :class="{ 'opacity-50 cursor-not-allowed': isEarliestWeek }">
                    <v-icon name="md-keyboardarrowleft" class=" h-9 w-9" :class="{ 'text-gray-500': isEarliestWeek }" />
                </button>
                <h1 class="text-lg font-bold">{{ displayDate }}</h1>
                <button @click="navigate(5)" class="cursor-pointer border rounded-full  items-center">
                    <v-icon name="md-keyboardarrowright" class=" h-9 w-9 text-cyan-800" />
                </button>

            </div>

            <!-- Days of the Week -->
            <div class="flex justify-between px-4">
                {{ timesData ? timesData.value : 'no data' }}
                <div v-for=" date  in  displayedDates " :key="date.toString()" class="text-center">
                    <div class="text-lg font-bold">{{ dayOfWeek(date) }}</div>
                    <div class="text-lg mt-1 border-gray-400/95 font-semibold flex items-center justify-center w-12 h-12 cursor-pointer rounded-full border dark:hover:border-cyan-600  hover:border-blue-500"
                        :class="{ 'bg-blue-500  text-white': isSelected(date), 'font-bold': isToday(date) }"
                        @click="selectDay(date)">
                        {{ date.getDate() }}
                    </div>
                    <!-- Conditional Dot Color Based on Available Times -->
                    <div
                        :class="{ 'h-3 w-3 rounded-full mx-auto mt-2': true, 'bg-green-500': hasTimes(date), 'bg-gray-400': !hasTimes(date) }">
                    </div>
                </div>
            </div>

            <!-- Times List or No Available Times Message -->
            <div class="space-y-2 px-4">
                <div class="flex flex-col space-y-2" v-if="selectedTimes.length > 0">
                    <div v-for="(time, index) in selectedTimes" v-show="index < 4 || showAllTimes"
                        @click="time.booked ? null : setActiveTime(time)" :class="{
                            'bg-cyan-700 text-white border-cyan-700': bookingStore.$state.activeTime === time && !time.booked,
                            'bg-gray-400 text-gray-500 cursor-not-allowed border-gray-400': time.booked,
                            'hover:border-cyan-700': !time.booked
                        }"
                        class="flex border-gray-300 items-center justify-center font-semibold rounded-md p-3 cursor-pointer border-2 transition-all duration-300">
                        {{ time.startTime }} - {{ time.endTime }}
                    </div>
                </div>
                <div v-else class="text-center text-md text-gray-500 max-w-[18rem] mx-auto line-clamp-3">
                    No appointments available on the selected date.
                </div>

                <button v-if="selectedTimes.length > 4 && !showAllTimes" @click="showAllTimes = true"
                    class="flex justify-center w-full text-blue-500 mt-2">
                    Show more
                </button>

                <button v-if="showAllTimes" @click="showAllTimes = false"
                    class="flex justify-center w-full text-blue-500 mt-2">
                    Show less
                </button>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">

const bookingStore = useBookingStore();
import { ref, computed, watch } from 'vue';
import { useBookingStore } from '../stateStores/bookingStore';
import { DENTIST_API } from '../utils/apiConfig';
import { useQuery } from '@tanstack/vue-query';

const emit = defineEmits(['time-selected']);

type TimeSlot = {
    dentistId: string;
    startTime: string;
    endTime: string;
    date: string;
    booked: boolean;
};

type DayTimes = {
    [key: string]: TimeSlot[];
};



// State to control whether all times are shown
const showAllTimes = ref(false);


// props for dentstryId
const props = defineProps({
    dentistryId: {
        type: String,
        required: true
    }
});



// fetch times from backend
const { isPending, isError, data: timesData } = useQuery<DayTimes>({
    queryKey: ['timeslots', props.dentistryId],
    queryFn: fetchTimes,
})


async function fetchTimes() {
    const response = await fetch(`${DENTIST_API}/clinics/${props.dentistryId}/appointment_slots`);
    const data = await response.json() as TimeSlot[];
    const dayTimes: DayTimes = {};
    data.forEach((time) => {
        if (!dayTimes[time.date]) {
            dayTimes[time.date] = [];
        }
        dayTimes[time.date].push(time);
    });
    return dayTimes;
}




const setActiveTime = (time: TimeSlot) => {
    bookingStore.setActiveTime(time);
    // temporary solution till data is fetched from backend
    const tempType = { ...time, date: selectedDate.value.toDateString() };
    emit('time-selected', tempType);
};


const initialDate = new Date(); // Store the initial date to compare against
initialDate.setHours(0, 0, 0, 0); // Normalize to start of the day for comparison

const startDate = ref(new Date(initialDate)); // Start date for the displayed dates
const selectedDate = ref(new Date(initialDate)); // Initialize with the current date
const selectedTimes = ref<TimeSlot[]>([]); // New ref for the selected day's times

// Helper functions
const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const navigate = (days: number) => {
    startDate.value = addDays(startDate.value, days);
};

const selectDay = (date: Date) => {
    const dateString = date.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    selectedTimes.value = timesData.value?.[dateString] || [];
    selectedDate.value = new Date(date);
};

const hasTimes = (date: Date) => {
    const dateString = date.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return Boolean(timesData.value?.[dateString]?.length);
};

const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.value.toDateString();
};

const isToday = (date: Date) => {
    return date.toDateString() === initialDate.toDateString();
};

const dayOfWeek = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Computed properties
const displayedDates = computed(() => {
    let dates = [];
    for (let i = 0; i < 5; i++) {
        dates.push(addDays(startDate.value, i));
    }
    return dates;
});

const displayDate = computed(() => {
    return selectedDate.value.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
    });
});

const isEarliestWeek = computed(() => {
    return displayedDates.value[0].getTime() <= initialDate.getTime();
});

watch(timesData, (newVal) => {
    console.log("timesData changed)")
    console.log(newVal)

    if (newVal) {
        const dateString = selectedDate.value.toLocaleDateString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        selectedTimes.value = newVal[dateString] || [];
    }
    // console.log("timesData changed)")



    // const dateString = selectedDate.value.toLocaleDateString('en-CA', {
    //     year: 'numeric',
    //     month: '2-digit',
    //     day: '2-digit',
    // });
    // selectedTimes.value = newVal[dateString];

});

</script>
  
<style></style>
  