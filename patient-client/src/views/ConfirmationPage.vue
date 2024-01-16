<template>
    <Toaster />
    <div class="container mx-auto p-12">
        <!-- Contact Details Section -->
        <h2 class="text-4xl font-bold mb-6 ">Confirm appointment details</h2>
        <div class="flex flex-wrap -mx-4">
            <!-- Left Section - Form Inputs -->
            <div class="w-full lg:w-1/3 px-4 mb-6 lg:mb-0">

                <div class="space-y-4 mb-6">
                    <div class="">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            for="name">firstname</label>
                        <input :value="userStore.user?.firstname" type="text" placeholder="First name *"
                            class="block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg sm:text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            required />
                    </div>
                    <div class="">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            for="lname">lastname</label>
                        <input :value="userStore.user?.lastname" type="text" placeholder="Last name *"
                            class="input-field bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            required />
                    </div>
                    <div class="">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            for="email">email</label>
                        <input :value="userStore.user?.email" type="email" placeholder="Email *"
                            class="input-field bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            required />
                    </div>
                    <div class="">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            for="phone">phone</label>
                        <input :value="userStore.user?.phone_number" type="tel" placeholder="Phone *"
                            class="input-field bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            required />
                    </div>
                </div>
                <div class="mb-6">
                    <h3 class="text-xl font-semibold mb-4">Appointment information</h3>
                    <p class="text-sm">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. In repellendus ipsum facere harum a
                        repellat nobis neque aspernatur, illo eos!
                    </p>
                </div>
                <!-- <button @click="handleBooking"
                    class="w-full px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Book appointment
                </button> -->
                <Button @click="handleSubmit" class="w-full"> Book appointment</Button>
            </div>

            <!-- Right Section - Appointment Details -->
            <div class="w-full lg:w-1/3 px-4">
                <div class="bg-white rounded-lg shadow-lg dark:bg-gray-700">
                    <img :src="bookingStore.bookingData?.dentistry.photo" alt="Office Interior"
                        class="rounded-t-lg object-cover w-full h-48" />
                    <div class="p-4 border-b">
                        <h3 class="text-lg font-semibold mb-2">{{ bookingStore.bookingData?.dentistry.name }}</h3>
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <p class="font-semibold">{{ bookingStore.bookingData?.data.date }}, </p>
                                <p class="font-semibold">
                                    {{ bookingStore.bookingData?.data.startTime }}
                                    - {{ bookingStore.bookingData?.data.endTime }}
                                </p>
                            </div>
                            <v-icon name="bi-calendar-check"
                                class="w-10 h-10  mr-1 text-gray-800 rounded-full p-2 dark:text-white" />
                        </div>
                    </div>
                    <div class="p-4 flex justify-between">
                        <p class="text-sm">
                            {{ bookingStore.bookingData?.dentistry.address }}
                        </p>
                        <v-icon name="fa-location-arrow"
                            class="w-10 h-10 self-end mr-1  rounded-full p-2 dark:text-white text-gray-800" />

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'


import { useBookingStore } from '../stateStores/bookingStore';
import { useUserStore } from '../stateStores/userStore';
import { Button } from '@/components/ui/button'
const bookingStore = useBookingStore();
const userStore = useUserStore();

import { useToast } from '@/components/ui/toast/use-toast'
import { PATIENT_API } from '@/utils/apiConfig';
import axios from 'axios';

import router from '@/router';
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/vue-query';
import { h, onMounted } from 'vue';
import { ToastAction } from '@/components/ui/toast';
const { toast } = useToast()

onMounted(function () {
    if (!bookingStore.bookingData) {
        router.push('/dentistry');
    }
});


const queryClient = useQueryClient()

const handleBooking = async () => {
    try {
        const response = await axios.post(`${PATIENT_API}/patients/${userStore.user?._id}/appointments`, {
            appointment_id: bookingStore.bookingData?.data._id
        }, {
            headers: { "x-access-token": `${userStore.jwt}` }
        });
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        console.error(error.response.data.message);
        throw new Error(error.response.data.message);
    }
};

const mutation = useMutation({
    mutationFn: handleBooking,
    onSuccess: () => {
        console.log('success');
        queryClient.invalidateQueries(['appointments'] as InvalidateQueryFilters);
        queryClient.invalidateQueries(['timeslots'] as InvalidateQueryFilters);
        toast({ title: 'Appointment booked successfully', variant: 'success' });
        router.push('/dashboard');

    },
    onError: (error) => {
        toast({
            title: error.message,
            variant: 'destructive',
            action: h(ToastAction, {
                altText: 'Go back to map',
                onClick: () => router.push('/mapview'),
            }, {
                default: () => 'Go back to map',

            }),
        });
    }

}
);

const handleSubmit = () => {
    mutation.mutate();
};


</script>
  
<style lang="css">
.input-field {
    display: block;
    width: 100%;
    padding: 0.5rem;
    border: 2px solid #e5e5e5;
    border-radius: 0.25rem;
    height: 2.5rem;
}

.input-field:focus {
    outline: 2px solid blue;
}

.btn-primary {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: blue;
    color: white;
    font-weight: bold;
    text-align: center;
    border-radius: 0.25rem;
    cursor: pointer;
}

.btn-primary:hover {
    background-color: darkblue;
}
</style>
  