<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from '../components/LoginForm.vue'
import SignupForm from '../components/SignupForm.vue'

const showSignUpForm = ref(false);

const toggleSignUpForm = () => {
    showSignUpForm.value = !showSignUpForm.value;
}

</script>


<template>
    <div class="min-h-screen flex text-black bg-gray-200 dark:bg-gray-800 dark:text-gray-50">
        <div
            class="bg-gray-50 dark:bg-gray-900 flex-[3] flex flex-col px-6 space-y-7 shadow-xl dark:border-none dark:rounded-none border justify-center rounded-tr-xl rounded-br-xl">
            <span class="flex items-center gap-2 justify-center">
                <img class="h-12 w-12 " src="../assets/tooth.svg" alt="tooth logo">
                <h1 class="text-4xl bg-blend-color-dodge font-bold">Patient Client</h1>
            </span>
            <p class="items-center flex justify-center font-semibold">
                {{ showSignUpForm ? "Create an account!" : "Login to your account!" }}
            </p>
            <SignupForm v-if="showSignUpForm" />
            <LoginForm v-else />


            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-gray-50 dark:bg-gray-900 dark:text-gray-50 text-gray-500">OR</span>
                </div>
            </div>
            <button @click="toggleSignUpForm"
                class="w-full dark:text-white text-gray-700 dark:hover:bg-gray-800 hover:text-white flex justify-center py-3 px-4 dark:bg-gray-700  border rounded-md shadow-sm text-sm font-medium dark:border-gray-400  border-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                {{ showSignUpForm ? 'Back to Login' : 'Signup now' }}</button>

        </div>
        <div class="md:flex flex-[7] p-8 justify-center items-center hidden">
            <img class="object-contain h-180 w-460 " src="../assets/loginbg.png" alt="">
        </div>
    </div>
</template>

<style scoped>
.or-divider::before,
.or-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #d1d5db;
}

.or-divider span {
    margin: 0 1rem;

}
</style>
