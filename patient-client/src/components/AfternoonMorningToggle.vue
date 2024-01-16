<template lang="">
     <div class="flex gap-2 items-center">
                        <button @click="handleChange('All')" class="px-4 py-2  rounded-full border-2 "
                            :class="{ 'border-cyan-600 dark:border-cyan-400 ': showingSearchResults.time == 'All' }">All</button>
                        <button @click="handleChange('Morning')"
                            :class="{ 'border-cyan-600': showingSearchResults.time == 'Morning' }"
                            class="px-4 py-2  rounded-full border-2">Morning</button>
                        <button @click="handleChange('Afternoon')"
                            :class="{ 'border-cyan-600': showingSearchResults.time == 'Afternoon' }"
                            class="px-4 py-2  rounded-full border-2">Afternoon</button>

                    </div>
</template>
<script setup lang="ts">
import router from '@/router';
import { ref } from 'vue';

type SearchInput = 'All' | 'Morning' | 'Afternoon';
const showingSearchResults = ref({ time: 'All' } as { time: SearchInput });


function handleChange(newValue: SearchInput) {
    showingSearchResults.value.time = newValue;

    router.push({
        query: {
            ...router.currentRoute.value.query,
            time: newValue
        }
    });
    console.log(showingSearchResults.value.time);
}


</script>
