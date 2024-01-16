<template lang="">
    <AlertDialog  :open="dialogState">
      <AlertDialogContent >
        <AlertDialogHeader >
          <AlertDialogTitle>Appointment alert!</AlertDialogTitle>
          <AlertDialogDescription>
            One of your appointments has been cancelled. Please check your email for more information.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>
            <button @click="handleOkClick">OK</button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </template>
  
<script setup lang="ts">
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/vue-query';
// @ts-expect-error idk why this says its unused .
import { dialogState, openDialog, closeDialog } from '../stateStores/cancelledAppointmentDialog.ts';
// @ts-expect-error idk why this says its unused .
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const queryClient = useQueryClient();

// @ts-expect-error idk why this says its unused .
const handleOkClick = () => {
  console.log('OK clicked')
  queryClient.invalidateQueries(['appointments'] as InvalidateQueryFilters);
  queryClient.invalidateQueries(['timeslots'] as InvalidateQueryFilters);
  closeDialog();
};
</script>
  
<style lang="">
  
  </style>
  