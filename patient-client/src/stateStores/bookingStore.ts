import { defineStore } from 'pinia';

interface Booking {
  data: TimeSlot;
  dentistry: Dentistry;
}

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookingData: null as Booking | null,
    activeTime: null as TimeSlot | null,
  }),
  actions: {
    setBookingData(data: any) {
      this.bookingData = data;
    },
    clearBookingData() {
      this.bookingData = null;
    },
    setActiveTime(data: any) {
      this.activeTime = data;
    },
  },
});
