<template>
    <l-map class="h-full z-7" :zoom="zoom" :center="center" :useGlobalLeaflet="false">
        <l-tile-layer :url="tileUrl" layer-type="base" name="Stadia Maps Basemap"></l-tile-layer>
        <l-marker v-if="usingCurrentLocation" :lat-lng="$props.usersLocation">
            <l-icon icon-url="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png"
                :icon-size="[40, 40]" :icon-anchor="[20, 40]"></l-icon>
            <l-popup content="You are here" :lat-lng="usersLocation" opened></l-popup>
        </l-marker>
        <l-marker @click="scrollToDentistry(dentistry._id)" v-for="dentistry in props.dentistries" :key="dentistry._id"
            :lat-lng="dentistry.coordinates">
            <l-popup :content="`<h1>${dentistry.name}</h1>`" :lat-lng="dentistry.coordinates"></l-popup>
        </l-marker>
    </l-map>
</template>

<script setup lang="ts">
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import { ref, computed, inject, PropType, nextTick, watch } from 'vue';

const props = defineProps({
    usersLocation: Object,
    usingCurrentLocation: Boolean,
    dentistries: Array as PropType<Dentistry[]>,
    selectedCityCoordinates: Object
});
const userStore = inject('userStore') as UserStore; // Assuming userStore is provided in your parent component

const center = ref([57.7089, 11.9746]); // Gothenburg coordinates
const zoom = ref(13);
// Watch for changes in selectedCityCoordinates
watch(() => props.selectedCityCoordinates, async (newCoordinates) => {
    console.log(newCoordinates)
    if (newCoordinates) {
        center.value = [newCoordinates.lat, newCoordinates.lng];
        await new Promise(r => setTimeout(r, 500));
        zoom.value = 13; // Adjust zoom level as needed
    }
}, { immediate: true });


// Watch for changes in usingCurrentLocation
watch(() => props.usingCurrentLocation, async (usingCurrentLocation) => {
    console.log(props.usersLocation)
    if (usingCurrentLocation) {

        if (!props.usersLocation) {
            return;
        }
        center.value = [props.usersLocation.lat, props.usersLocation.lng];
        await new Promise(r => setTimeout(r, 500));
        zoom.value = 12;

    }
}, { immediate: false });





const tileUrl = computed(() => userStore.darkMode
    ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
    : 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png');



const scrollToDentistry = (dentistryId: string) => {
    nextTick(() => {
        const dentistryElement = document.getElementById(`dentistry-${dentistryId}`);
        if (dentistryElement) {
            dentistryElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }
    });
};
</script>