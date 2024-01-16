<template>
    <div :id="`dentistry-${dentistry._id}`"
        class="mx-auto bg-white dark:bg-gray-800 shadow-sm hover:shadow-md rounded-lg p-4 flex flex-col lg:flex-row justify-between transition-shadow max-w-6xl ">
        <div class="flex flex-1 gap-3">

            <div class="flex flex-col space-y-2">
                <h1 class="text-xl font-bold">{{ dentistry.name }}</h1>
                <p class="text-gray-500">{{ dentistry.address }}</p>
                <img :src="dentistry.photo" alt="" class="rounded-lg object-cover" />
                <span v-if="farFromUser" class="text-md flex items-center">
                    <v-icon name="io-location" class="h-5 w-5 text-red-600 mr-2" />
                    <p class="text-gray-500 text-lg font-medium">{{ farFromUser.toFixed(2) }} km</p>
                </span>
            </div>
        </div>
        <div class="flex-none py-2 w-auto xl:w-1/2">
            <DentistryCardTimePicker :dentistry-id="dentistry._id" :time-slots="dentistry.slots"
                @time-selected="onTimeSelected" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import DentistryCardTimePicker from './DentistryCardTimePicker.vue';



const emit = defineEmits(['time-selected']);

const props = defineProps({
    dentistry: {
        type: Object as PropType<Dentistry>,
        required: true
    },
    farFromUser: {
        type: Number,
        required: false
    },
});


function onTimeSelected(data: unknown) {
    // add dentistry data to the payload and re-emit
    emit('time-selected', { data, dentistry: props.dentistry });
}
</script>

<style scoped>
/* You can set a specific max-width for large screens or use a percentage */
@media (min-width: 1024px) {
    .max-w-6xl {
        max-width: 1280px;
        /* Adjust this value based on your design preference */
    }
}
</style>
