import { defineStore } from 'pinia';
import axios from 'axios';
import { PATIENT_API } from '../utils/apiConfig';
import { deleteCookie, getCookie } from '../utils/cookieHandler';
import router from '../router'; // Import your router

export const useUserStore = defineStore('user', {
  // The state must be a function to return a fresh object
  state: () => ({
    user: null as User | null,
    jwt: null as string | null,
    darkMode: undefined as boolean | undefined,
  }),

  // Getters are similar to computed properties and are cached
  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => !!state.user,
  },

  // Actions are functions that can cause side effects and can be asynchronous
  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
    setToken(token: string | null) {
      this.jwt = token;
    },

    logout() {
      // Delete the token cookie
      deleteCookie('token');
      // Reset the state
      this.user = null;
      // Redirect to auth page
      router.push('/auth');
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
      if (this.darkMode === true) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    // Init function to check if user is null but has a token => get user from DB
    async init() {
      // check local storage for darkmode preference
      const darkMode = localStorage.getItem('darkMode');
      if (darkMode) {
        this.darkMode = JSON.parse(darkMode);

        if (this.darkMode === true) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      console.log(this.darkMode);
      if (!this.user) {
        const token = getCookie('token');
        if (token) {
          await this.getCurrentUserFromDB();
        }
      }
    },

    async getCurrentUserFromDB() {
      try {
        const token = getCookie('token');
        const response = await axios.get(
          `${PATIENT_API}/patients/current-user`,
          {
            headers: {
              'x-access-token': token,
            },
          }
        );
        const user = response.data as User;
        this.setUser(user);
        this.setToken(token as string);
        console.log(this.user);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
