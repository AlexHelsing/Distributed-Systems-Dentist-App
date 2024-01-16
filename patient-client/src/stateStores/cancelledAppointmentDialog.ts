import { ref } from 'vue';

export const dialogState = ref(false);

export const openDialog = () => {
  dialogState.value = true;
};

export const closeDialog = () => {
  dialogState.value = false;
};
