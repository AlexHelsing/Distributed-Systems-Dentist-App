<template>
    <header class="bg-white shadow dark:bg-gray-900 dark:border-b border-cyan-900 ">
        <div class="max-w-8xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div class="flex gap-20 items-center">
                <span class="flex gap-2 items-center cursor-pointer">
                    <img class="h-12 w-12" src="../assets/tooth.svg" alt="tooth logo">
                    <h1 class="text-3xl font-bold">Dentist App</h1>
                </span>

                <nav class="md:flex gap-8 items-center hidden">
                    <RouterLink to="/dashboard"
                        class="text-gray-700 hover:text-cyan-700 dark:text-gray-200 dark:hover:text-gray-100  font-semibold   relative text-2xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black dark:after:bg-cyan-400 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">
                        Appointments</RouterLink>
                    <RouterLink to="/mapview"
                        class="text-gray-600 hover:text-cyan-700 font-semibold dark:text-gray-200 dark:hover:text-gray-100   relative text-2xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black dark:after:bg-cyan-400 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">
                        Dentistries</RouterLink>


                </nav>

            </div>



            <div class="md:flex gap-4 items-center hidden">


                <Switch :checked="userStore.darkMode" @update:checked="toggleDarkMode" />


                <!-- <BellAlertIcon
                    class="h-12 w-12 text-gray-800 dark:text-gray-200 cursor-pointer dark:hover-text-gray-300 hover:text-cyan-700" /> -->
                <Button class="rounded-full bg-purple-600 h-12 w-12 font-bold text-white" type="button"
                    icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">{{
                        getInitials() }}</Button>
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />


            </div>

            <!-- Mobile menu button -->
            <button @click="toggleHamburger"
                class="inline-flex items-center justify-end p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white md:hidden">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>


        </div>


        <!-- Mobile navbar-->

        <nav v-if="hamburgerToggle" class="flex flex-col gap-4 items-center py-4 md:hidden">
            <RouterLink to="/dashboard"
                class="text-gray-700 hover:text-cyan-700 font-semibold   relative text-2xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">
                Appointments</RouterLink>
            <RouterLink to="/mapview"
                class="text-gray-600 hover:text-cyan-700 font-semibold   relative text-2xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">
                Dentistries</RouterLink>
            <button class="bg-gray-800 text-white font-bold p-2 rounded-lg hover:bg-gray-700"
                @click="logout">LOGOUT</button>
            <!-- <h1 class="text-blue-600 hover:text-blue-700 font-semibold">Payments</h1>
                    <h1 class="text-blue-600 hover:text-blue-700 font-semibold">Settings</h1> -->
        </nav>


    </header>
</template>
<script setup lang="ts">
// import { BellAlertIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '../stateStores/userStore'
import Button from 'primevue/button';
import { Switch } from '@/components/ui/switch'
import Menu from 'primevue/menu';
const userStore = useUserStore()


const toggleDarkMode = () => {
    userStore.toggleDarkMode();
};

const hamburgerToggle = ref(false)


const toggleHamburger = () => {
    hamburgerToggle.value = !hamburgerToggle.value
}

function logout() {
    userStore.logout();
}


function getInitials() {
    if (userStore.getUser?.firstname && userStore.getUser?.lastname) {
        const firstInitial = userStore.getUser.firstname.charAt(0).toLocaleUpperCase()
        const lastInitial = userStore.getUser.lastname.charAt(0).toLocaleUpperCase()
        return firstInitial + lastInitial
    } else {
        return '...'


    }
}

const menu = ref();
const items = ref([
    {
        label: 'User Profile',
        items: [
            {
                label: 'Logout',
                icon: 'pi pi-upload',
                command: () => {
                    logout();
                }

            }
        ]
    }
]);

const toggle = (event: Event) => {
    console.log(event);
    menu.value.toggle(event);
};
</script>
<style lang="">

    </style>
