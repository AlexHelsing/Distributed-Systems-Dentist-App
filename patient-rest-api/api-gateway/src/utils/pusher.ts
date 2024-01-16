import Pusher from 'pusher';

const pusher = new Pusher({
  appId: '1724077',
  key: '5d9ec44495bc6ef9c4ea',
  secret: '5f2b2e42f1e045dafed7',
  cluster: 'eu',
  useTLS: true,
});

export default pusher;
