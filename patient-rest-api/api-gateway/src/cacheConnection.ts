import { createClient } from 'redis';

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

const connectCache = async () => {
    try {
      await client.connect();
      console.log('Redis Cache connected');
    } catch (error: any) {
      console.error('Redis Cache connection failed:', error.message);
      process.exit(1); 
    }
  };

  export default connectCache