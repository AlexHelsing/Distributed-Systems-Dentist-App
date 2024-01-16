import mqtt from 'mqtt';

import * as dotenv from 'dotenv';
dotenv.config({ path: 'src/config/.env' });

const BROKER_URL = process.env.MQTT_BROKER_URL || ""; 
const USER = process.env.MQTT_USER || '';
const PASSWORD = process.env.MQTT_PASSWORD || '';

const options = {
    username: USER,
    password: PASSWORD
}

const client =  mqtt.connect(BROKER_URL, options);

client.on('connect', () => {
    console.log(`Mqtt connected to broker at ${BROKER_URL}`);
})

client.on('error', (err) => {
    console.error(err.message)
})

let publishAsync = (reqTopic: string, payload: object | Array<any> | string) => new Promise<void>((resolve, reject) => {
    client.publish(reqTopic, JSON.stringify(payload), {qos: 1}, (err) => {
        if(err !== null) {
            console.log(err)
            reject(err)
        }
        resolve();
    })
});


let subscribeAsync = (resTopic: string) => new Promise<void>((resolve, reject) => {
    client.subscribe(resTopic, (err) => {
        if(err !== null) {
            console.log(err);
            reject(err);
        }
        resolve()
    })
});

async function handleMqtt(requestTopic: string, responseTopic: string, payload: object | Array<any> | string) {    

    await Promise.all([subscribeAsync(responseTopic), publishAsync(requestTopic, payload)]);

    return new Promise<any>((resolve, reject) => {
        
        let isResponsed = false;
        
        const timeout = setTimeout(() => {
            if(!isResponsed) reject(new Error('Mqtt timeout'));
        }, 6000);

        client.on('message', (topic, payload, packet) => {
            if(responseTopic === topic) {
                try{
                    isResponsed = true;
                    clearTimeout(timeout);

                    client.unsubscribe(responseTopic);
                    console.log(`topic: ${topic}, payload: ${payload}`);
                    resolve(JSON.parse(payload.toString()));
                }catch(err) {
                    reject(err)
                }
        }});        
    });
}

export {client, handleMqtt};