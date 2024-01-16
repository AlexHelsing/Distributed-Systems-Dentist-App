<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { PropType, ref } from 'vue'


const isOpen = ref(false)


const props = defineProps({
    userDetails: {
        type: Object as PropType<User>,
        required: true,
    },
})

const emit = defineEmits(['handleEditProfile', 'handleChangePassword'])


const handleEditProfileContinue = () => {
    if (!email.value.includes('@')) {
        // Handle invalid email (e.g., show an error message)
        alert('Please enter a valid email address.'); // Replace with your preferred error handling
        return; // Prevent form submission
    }


    isOpen.value = false
    emit('handleEditProfile', {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        phone_number: phone.value,
    } as User) // Emitting the event with the appointment as payload
}


const handleChangePassword = (e: Event) => {
    e.preventDefault()
    if (password.value.length < 8) {
        // Handle invalid password (e.g., show an error message)
        alert('Password must be at least 8 characters long.'); // Replace with your preferred error handling
        return; // Prevent form submission
    }

    isOpen.value = false
    emit('handleChangePassword', password.value) // Emitting the event with the appointment as payload
}

// create refs for each input field
const firstname = ref(props.userDetails.firstname)
const lastname = ref(props.userDetails.lastname)
const email = ref(props.userDetails.email)
const phone = ref(props.userDetails.phone_number)


// ref for password
const password = ref('')


</script>

<template>
    <AlertDialog :open="isOpen">
        <Button size="sm" @click="isOpen = true">Edit account</Button>
        <AlertDialogContent>
            <AlertDialogTitle class="hidden">Edit account</AlertDialogTitle>
            <AlertDialogDescription>
                <Tabs default-value="account">
                    <TabsList class="grid w-full grid-cols-2">
                        <TabsTrigger value="account">
                            Account
                        </TabsTrigger>
                        <TabsTrigger value="password">
                            Password
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account</CardTitle>
                                <CardDescription>
                                    Make changes to your account here. Click save when you're done.
                                </CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-2">
                                <div class="flex gap-4">
                                    <div class="space-y-1">
                                        <Label for="firstname">Firstname</Label>
                                        <Input id="username" v-model="firstname"
                                            :default-value="props.userDetails.firstname" />
                                    </div>
                                    <div class="space-y-1">
                                        <Label for="lastname">Lastname</Label>
                                        <Input id="username" v-model="lastname"
                                            :default-value="props.userDetails.lastname" />
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <Label for="email">Email</Label>
                                    <Input autocomplete="email" type="email" id="email" v-model="email"
                                        :default-value="props.userDetails.email" />
                                </div>
                                <div class="space-y-1">
                                    <Label for="phone">Phone</Label>
                                    <Input type="tel" id="phone" v-model="(phone as number)"
                                        :default-value="(props.userDetails.phone_number as number)" />
                                </div>

                            </CardContent>
                            <CardFooter class="gap-2 flex">
                                <Button @click="isOpen = false" variant="secondary">Cancel</Button>
                                <Button @click="handleEditProfileContinue">Save changes</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <form @submit="handleChangePassword">
                        <TabsContent value="password">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Password</CardTitle>
                                    <CardDescription>
                                        Change your password here. After saving, you'll be logged out.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent class="space-y-2">
                                    <!-- <div class="space-y-1">
                                <Label for="current">Current password</Label>
                                <Input id="current" type="password" />
                            </div> -->
                                    <div class="space-y-1">
                                        <Label for="new">New password</Label>
                                        <Input v-model="password" autocomplete="new-password" id="new" type="password" />
                                    </div>
                                </CardContent>
                                <CardFooter class="flex gap-2">
                                    <Button type="button" @click="isOpen = false" variant="secondary">Cancel</Button>
                                    <Button type="submit">Save password</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </form>
                </Tabs>
            </AlertDialogDescription>
        </AlertDialogContent>
    </AlertDialog>
</template>