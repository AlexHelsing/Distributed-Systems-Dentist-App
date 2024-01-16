<template>
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 flex flex-col md:flex-row justify-between max-w-full">
        <div class="flex flex-1 max-w-lg gap-3">
            <div class="flex flex-col space-y-2">
                <!-- Skeleton for the Dentistry Name -->
                <Skeleton class="h-6  rounded-md w-3/4"></Skeleton>

                <!-- Skeleton for the Address -->
                <Skeleton class="h-4  rounded-md w-1/2"></Skeleton>

                <!-- Skeleton for the Image -->
                <Skeleton class="h-40 w-80  rounded-lg"></Skeleton>

                <!-- Skeleton for Distance Information -->
                <div class="flex items-center mt-2">
                    <Skeleton class="h-4  rounded-md w-10 mr-2"></Skeleton>
                    <Skeleton class="h-4  rounded-md w-16"></Skeleton>
                </div>
            </div>
        </div>

        <!-- Skeleton for Time Picker -->
        <div class="flex-none py-2 w-48">
            <Skeleton class="h-[25%] rounded-md mb-2"></Skeleton>
            <Skeleton class="h-[10%] rounded-md mt-7 mb-2"></Skeleton>
            <Skeleton class="h-[10%] rounded-md mb-2"></Skeleton>
            <Skeleton class="h-[10%] rounded-md mb-2"></Skeleton>
            <Skeleton class="h-[10%] rounded-md"></Skeleton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
</script>

<style scoped>
/* You can add any additional styling for the skeleton here */
</style>
