<script setup lang="ts">
import { useRouter } from 'vue-router';
import axios from 'axios';
import { PATIENT_API } from '../utils/apiConfig';
import { setCookie } from '../utils/cookieHandler';
import { useUserStore } from '../stateStores/userStore';
import { z } from 'zod';
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const router = useRouter();


const userStore = useUserStore();

const formSchema = toTypedSchema(z.object({
    firstname: z
        .string()
        .min(2, {
            message: 'firstname must be at least 2 characters.',
        })
        .max(30, {
            message: 'firstname must not be longer than 30 characters.',
        }),
    lastname: z
        .string()
        .min(2, {
            message: 'lastname must be at least 2 characters.',
        })
        .max(30, {
            message: 'lastname must not be longer than 30 characters.',
        }),
    phone_number: z.string().min(10, { message: 'Phone number must be at least 10 characters.' }).max(20, { message: 'Phone number must not be longer than 20 characters.' }),

    email: z
        .string({
            required_error: 'Please select an email to display.',
        })
        .email(),
    password: z
        .string({
            required_error: 'Please select a password.',
        })
        .min(8, {
            message: 'Password must be at least 8 characters.',
        })
        .max(30, {
            message: 'Password must not be longer than 30 characters.',
        }),

    year: z.string().min(4, { message: 'Year must be at least 4 characters.' }).max(4, { message: 'Year must not be longer than 4 characters.' }),
    month: z.string().min(2, { message: 'Month must be at least 2 characters.' }).max(2, { message: 'Month must not be longer than 2 characters.' }),
    day: z.string().min(2, { message: 'Day must be at least 2 characters.' }).max(2, { message: 'Day must not be longer than 2 characters.' }),



}))

const form = useForm({
    validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
    console.log('Form submitted!', values)

    try {

        axios.post(`${PATIENT_API}/patients`, {
            email: values.email,
            password: values.password,
            firstname: values.firstname,
            lastname: values.lastname,
            phone_number: Number(values.phone_number),
            DOB: `${values.year}-${values.month}-${values.day}`
        })
            .then(response => {
                const data = response.data;
                const token = data.token;

                // set session token
                setCookie('token', token);

                // update user state
                userStore.setUser({
                    email: data.email,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    phone_number: data.phone_number,
                    _id: data._id,
                });

                // set user token in state as-well because why not
                userStore.setToken(token);

                // redirect to dashboard
                router.push('/dashboard');
            })
            .catch(error => {
                console.log(error);
                alert(error.response.data.message);
            });

    } catch (error) {
        console.log(error);

    }
})
</script>


<template>
    <form @submit="onSubmit" class="space-y-4 md:space-y-6 p-4 md:p-0">


        <FormField v-slot="{ componentField }" name="email">
            <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input class="" type="email" placeholder="Enter your email" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>



        <FormField v-slot="{ componentField }" name="password">
            <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="Enter your password" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>



        <div class="mt-1 flex md:flex-row gap-3 ">
            <FormField v-slot="{ componentField }" name="firstname">
                <FormItem class="w-1/2">
                    <FormLabel>Firstname</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="firstname" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="lastname">
                <FormItem class="w-1/2">
                    <FormLabel>Lastname</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="lastname" v-bind="componentField" />

                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

        </div>




        <FormField v-slot="{ componentField }" name="phone_number">
            <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="Phone number" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>




        <div class="mt-1 flex  md:flex-row gap-3 ">
            <FormField v-slot="{ componentField }" name="year">
                <FormItem class="w-1/3">
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="Year" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="month">
                <FormItem class="w-1/3">
                    <FormLabel>Month</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="Month" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="day">
                <FormItem class="w-1/3">
                    <FormLabel>Day</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="Day" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
        </div>

        <button type="submit"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white dark:text-gray-800  dark:bg-gray-50 dark:hover:bg-gray-300 bg-cyan-500 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
            Create account
        </button>

    </form>
</template>

<style lang="">
    
</style>