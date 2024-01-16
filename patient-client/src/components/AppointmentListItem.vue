<template>
    <div
        class="border cursor-pointer border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div class="flex justify-between items-start">
            <div>
                <h3 class="text-xl font-semibold text-gray-800 dark:text-white">{{ Appointment.clinicName }}</h3>
                <p class="text-gray-500 dark:text-gray-300 mt-1">Lorem ipsum dolor sit amet.</p>
                <p>{{ Appointment._id }}</p>
            </div>
            <div class="text-right">
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ Appointment.date }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ Appointment.startTime }} - {{ Appointment.endTime }}
                </p>
            </div>
        </div>
        <div class="mt-4">
            <AlertDialog :open="isOpen">
                <AlertDialogTrigger>
                    <Button @click="isOpen = true" variant="destructive"
                        class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">
                        Cancel Appointment
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle class="text-lg font-semibold">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription class="mt-2 text-gray-600">
                            This action cannot be undone. This will permanently delete your appointment
                            data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter class="flex justify-end gap-1 mt-4">
                        <Button variant="outline" @click="isOpen = false">Cancel</Button>


                        <Button @click="handleContinue">Continue</Button>

                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const isOpen = ref(false);

const emit = defineEmits(['handleCancelAppointment']);

// emit an event to parent component when continue is clicked
const handleContinue = () => {
    isOpen.value = false;
    emit('handleCancelAppointment', props.Appointment._id); // Emitting the event with the appointment as payload
};




const props = defineProps({
    Appointment: {
        type: Object as PropType<Appointment>,
        required: true
    },
});
</script>
<style lang="">
    
</style>