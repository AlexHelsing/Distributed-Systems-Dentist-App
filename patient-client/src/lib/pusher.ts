import PusherClient from 'pusher-js';
import { openDialog } from '../stateStores/cancelledAppointmentDialog';

export const pusherClient = new PusherClient('5d9ec44495bc6ef9c4ea', {
  cluster: 'eu',
});

const globalSubscriptions: { [key: string]: any } = {};

export const subscribeToUpdates = (userId: string) => {
  const channelName = `user-${userId}`;
  if (!globalSubscriptions[channelName]) {
    const channel = pusherClient.subscribe(channelName);
    channel.bind('appointment-cancelled', () => {
      openDialog();
    });
    globalSubscriptions[channelName] = channel;
    console.log('subscribed to', channelName);
  }

  // // Subscribe to global timeslot updates
  // const timeslotChannelName = 'global-channel';
  // if (!globalSubscriptions[timeslotChannelName]) {
  //   const timeslotChannel = pusherClient.subscribe(timeslotChannelName);
  //   timeslotChannel.bind('appointment-event', () => {
  //     console.log('timeslot updated');
  //     const event = new Event('timeslot-updated');
  //     window.dispatchEvent(event);
  //   });
  //   globalSubscriptions[timeslotChannelName] = timeslotChannel;
  //   console.log('subscribed to', timeslotChannelName);
  // }
};

export const subscribeToGlobalTimeslotUpdates = () => {
  // Subscribe to global timeslot updates
  const timeslotChannelName = 'global-channel';
  if (!globalSubscriptions[timeslotChannelName]) {
    const timeslotChannel = pusherClient.subscribe(timeslotChannelName);
    timeslotChannel.bind('appointment-event', () => {
      console.log('timeslot updated');
      const event = new Event('timeslot-updated');
      window.dispatchEvent(event);
    });
    globalSubscriptions[timeslotChannelName] = timeslotChannel;
    console.log('subscribed to', timeslotChannelName);
  }
};

export const unsubscribeFromGlobalTimeslotUpdates = () => {
  const timeslotChannelName = 'global-channel';
  if (globalSubscriptions[timeslotChannelName]) {
    pusherClient.unsubscribe(timeslotChannelName);
    delete globalSubscriptions[timeslotChannelName];
    console.log('unsubscribed from', timeslotChannelName);
  }
};
