<template>
    <Toaster />
    <div class=" flex flex-col md:flex-row flex-1    ">
        <div class=" md:w-[30%] flex flex-col justify-between gap-3 p-6">
            <div class="flex flex-col space-y-2">
                <div class="flex bg-gray-300 dark:bg-gray-800 flex-col rounded-lg items-center p-4 ">
                    <span class="rounded-full bg-purple-600 h-12 w-12" alt="" />
                    <h1 class="text-lg font-bold">{{ userStore.getUser?.firstname }} {{ userStore.getUser?.lastname }}</h1>



                    <p class="text-gray-500">{{ userStore.getUser?.phone_number }}</p>
                    <EditProfileComponent @handle-change-password="changePassword" @handle-edit-profile="editProfile"
                        v-if="userStore.user" :user-details="userStore.user" />
                </div>




                <div class="flex card  flex-col  bg-gray-300 dark:bg-gray-800 ">
                    <span @click="handleToggle('upcoming')"
                        class="flex gap-2 py-2 px-1 hover:bg-cyan-500 dark:hover:bg-gray-500 hover:text-white hover:font-bold cursor-pointer"
                        :class="{ 'bg-cyan-500 text-white font-bold dark:bg-gray-500': !showPast }">
                        <CalendarDaysIcon class="h-8 w-8" />
                        <h1 class="text-lg font-semibold">Upcoming appointments</h1>
                    </span>
                    <span @click="handleToggle('past')"
                        class="flex gap-2 py-2 px-1 dark:hover:bg-gray-500 hover:text-white hover:font-bold hover:bg-cyan-500 cursor-pointer"
                        :class="{ 'bg-cyan-500 text-white font-bold dark:bg-gray-500 dark:hover:bg-gray-500': showPast }">
                        <ArchiveBoxIcon class="h-8 w-8" />
                        <h1 class="text-lg font-semibold">Appointment history</h1>
                    </span>

                    <!-- <Dialog :on-vnode-unmounted="handleModalClose" v-model:visible="visible" header="What day?"
                        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :modal="true" :draggable="false">
                        <Calendar v-model="date" inline showWeek />
                        <template #footer>
                            <div class="flex gap-2 justify-end">

                                <button v-if="date" @click="handleSubmitModal" class=" bg-green-500 p-3 text-white font-bold rounded-lg
                                hover:bg-green-600">Continue</button>
                            </div>
                        </template>
                    </Dialog> -->
                    <!-- <span class="flex gap-2 py-2 px-1 hover:bg-blue-400 cursor-pointer">
                    <ArchiveBoxIcon class="h-8 w-8" />
                    <h1 class="text-lg font-semibold">New appointment</h1>
                </span> -->

                </div>
            </div>

            <Button @click="() => {
                router.push('/mapview');
            }">Make an appointment</Button>
        </div>





        <div v-if="!showPast" class="w-full   p-8 gap-4 flex flex-col">
            <div class="flex gap-4 py-2">
                <h1 class="text-4xl">Upcoming Appointments</h1>
                <!-- <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Make an appointment
                    </button> -->

            </div>
            <div v-if="appointments?.length === 0"
                class="border h-full flex flex-col justify-center items-center  border-gray-300 dark:border-slate-800 rounded-lg p-7 ">
                <img class=" object-contain" src="/src/assets/kerfin7_nea_2761 1.png" alt="">
                <p class="text-xl font-medium">Seems you dont have any bookings, click <span @click="() => {
                    router.push('/mapview');
                }" class="font-bold text-xl  cursor-pointer text-blue-600">
                        here</span> to make an appointment</p>
            </div>
            <div v-else class="">
                <!-- <Dialog v-model:visible="visibleAppointmentModal" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
                    :modal="true" :draggable="false">
                    <template #footer>
                        <div class="flex gap-2 justify-end ">

                            <button class=" bg-red-500 p-3 text-white font-bold rounded-lg
                                ">Cancel Appointment</button>
                        </div>
                    </template>
                </Dialog> -->
                <div v-if="isPending" class="">...</div>
                <div v-else class="flex flex-col gap-4 md:grid md:grid-cols-2 ">
                    <AppointmentListItemVue @handle-cancel-appointment="handleCancelEmit" :Appointment="appointment"
                        v-for="appointment in appointments" :key="appointment._id" />
                </div>
            </div>
        </div>


        <div v-else class="w-full p-8 gap-4 flex flex-col">
            <div class="flex gap-4">
                <h1 class="text-4xl">Past Appointments</h1>
                <!-- <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Make an appointment
                    </button> -->


            </div>



        </div>
    </div>
</template>
  
<script setup lang="ts">
import AppointmentListItemVue from "../components/AppointmentListItem.vue";
import { useToast } from '@/components/ui/toast/use-toast'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useUserStore } from '../stateStores/userStore';
import { ArchiveBoxIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'
import EditProfileComponent from "@/components/EditProfileComponent.vue";
import { Button } from '@/components/ui/button'
import router from '../router';
import axios from 'axios';
import { PATIENT_API } from '../utils/apiConfig';
import { getCookie } from '../utils/cookieHandler';
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref } from "vue";
const queryClient = useQueryClient()
// const date = ref(null);
const showPast = ref(false);

const { toast } = useToast()


// const visible = ref(false);
// const visibleAppointmentModal = ref(false);

const userStore = useUserStore();


const { isPending, data: appointments } = useQuery<Appointment[]>({
    queryKey: ['appointments'],
    queryFn: getUserAppointments,
})




async function getUserAppointments() {
    try {
        const response = await axios.get(`${PATIENT_API}/patients/${userStore.user?._id}/appointments/`, {
            headers: {
                'x-access-token': `${userStore.jwt}`
            }
        });



        return response.data;

    } catch (error) {
        console.error(error);
        // Handle error case here
        toast({
            title: 'An error occurred',
            variant: 'destructive',
            description: 'Your appointments could not be fetched. Please try again later.',
        });

    }

}

async function cancelAppointment(appointmentId: string) {
    axios.put(`${PATIENT_API}/patients/${userStore.user?._id}/appointments/${appointmentId}`, {
        headers: {
            'x-access-token': `${getCookie('token')}`
        }

    })
        .then((response) => {
            console.log(response.data);

            toast({
                title: 'Appointment cancelled',
                description: 'Your appointment has been cancelled',
            })

            return response.data;
        }, (error) => {
            console.log(error);
        });

}

const mutation = useMutation({
    mutationFn: cancelAppointment,
})

async function editProfile(userDetails: User) {
    try {
        const response = await axios.put(`${PATIENT_API}/patients/${userStore.user?._id}`, {
            email: userDetails.email,
            firstname: userDetails.firstname,
            lastname: userDetails.lastname,
            phone_number: userDetails.phone_number,
        }, {
            headers: {
                'x-access-token': `${userStore.jwt}`
            }
        });


        console.log(response.data);

        // Update user store only if the request is successful and the status code is 200
        userStore.setUser({
            email: response.data.email,
            firstname: response.data.firstname,
            lastname: response.data.lastname,
            phone_number: response.data.phone_number,
            _id: response.data._id
        });

        toast({
            title: 'Profile updated',
            description: 'Your profile has been updated successfully.',
        });


    } catch (error) {
        console.error(error);
        // Handle error case here
        toast({
            title: 'An error occurred',
            variant: 'destructive',
            description: 'Your profile could not be updated. Please try again later.',
        });
    }
}

async function changePassword(password: string) {
    try {
        await axios.put(`${PATIENT_API}/patients/${userStore.user?._id}`, {
            password: password,
        }, {
            headers: {
                'x-access-token': `${userStore.jwt}`
            }
        });


        toast({
            title: 'Password updated',
            description: 'Your password has been updated successfully.',
        });


    }





    catch (error) {
        console.error(error);
        // Handle error case here
        toast({
            title: 'An error occurred',
            variant: 'destructive',
            description: 'Your password could not be updated. Please try again later.',
        });
    }
}


const handleToggle = (pressed: string) => {
    if (pressed === 'upcoming') {
        showPast.value = false;
    } else {
        showPast.value = true;
    }
};

const handleCancelEmit = (appointmentId: string) => {
    console.log('cancel appointment' + appointmentId)
    mutation.mutate(appointmentId, {
        onSuccess: () => {
            console.log('success');
            queryClient.invalidateQueries(['appointments'] as InvalidateQueryFilters)
            queryClient.invalidateQueries(['timeslots'] as InvalidateQueryFilters)
        },
    })
};

// const appointments = ref([] as Appointment[]);

// create some mockup appointments

// const handleSubmitModal = () => {
//     console.log('go next step ie mapview');
//     date.value = null;
//     visible.value = false;
//     router.push('/mapview');
// };


// const handleModalClose = () => {
//     console.log('modal closed');
//     date.value = null;
// };

</script>