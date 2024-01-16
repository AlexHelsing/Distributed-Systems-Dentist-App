<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { PATIENT_API } from '../utils/apiConfig';
import axios from 'axios';
import { useUserStore } from '../stateStores/userStore';
import { setCookie } from '../utils/cookieHandler';

const router = useRouter();
const userStore = useUserStore();

async function handleSignIn(e: Event) {
    e.preventDefault();

    if (!email.value || !password.value) {
        alert('Please enter your email and password');
        return;
    }

    axios.post(`${PATIENT_API}/patients/login`, {
        email: email.value,
        password: password.value,
    }).then((response) => {
        console.log(response);
        const token = response.data.token;
        // set session token
        setCookie('token', token);

        // update user state
        userStore.setUser({
            email: response.data.email,
            firstname: response.data.firstname,
            lastname: response.data.lastname,
            phone_number: response.data.phone_number,
            _id: response.data._id
        });

        // set user token in state as-well because why not
        userStore.setToken(token);

        //redirect to dashboard
        router.push('/dashboard');

    }
    ).catch((error) => {
        console.log(error);
        alert('Invalid email or password');
    });

}
const email = ref('');
const password = ref('');



</script>
<template>
    <form @submit="handleSignIn" class="space-y-6 dark:text-gray-50">
        <div class="relative">
            <label for="Email address" class="block text-sm font-medium text-gray-700">Email address</label>
            <div class="mt-1 relative rounded-md shadow-sm">
                <input autocomplete="email" v-model="email" id="Email" type="Email"
                    class="form-input block w-full py-4 pl-4 pr-10 bg-gray-200 dark:bg-gray-800 border-gray-300 rounded-md focus:outline-none sm:text-sm"
                    placeholder="Enter your Email">
                <div
                    class="absolute inset-y-0 cursor-default bg-cyan-500 dark:bg-slate-400 px-4 right-0 flex justify-center items-center ">
                    <img src="../assets/envelope.svg" class="h-6 w-6 " alt="">
                </div>
            </div>
        </div>
        <div class="relative ">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1 relative rounded-md shadow-sm">
                <input autocomplete="current-password" v-model="password" id="password" type="password"
                    class="form-input block w-full py-4 pl-4 pr-10 dark:bg-gray-800 bg-gray-200 border-gray-300 rounded-md focus:outline-none sm:text-sm"
                    placeholder="Enter your password">
                <div
                    class="absolute inset-y-0 cursor-default bg-cyan-500 dark:bg-slate-400 px-4 right-0 flex justify-center items-center ">
                    <img src="../assets/lock.svg" class="h-6 w-6 " alt="">
                </div>
            </div>
        </div>
        <div class="flex items-center justify-between">
            <div class="text-sm">
                <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>
        </div>
        <button type="submit"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white dark:text-gray-800  dark:bg-gray-50 dark:hover:bg-gray-300 bg-cyan-500 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">Login
            now</button>
    </form>
</template>

<style lang="">
    
</style>