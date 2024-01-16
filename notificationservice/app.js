const mqtt = require('mqtt')
const axios = require('axios');
const { sendMail } = require('./src/gmailer');
require('dotenv').config({path: 'config/.env'})
console.log(process.env.MQTT_BROKER_URL)

const BROKER_URL = process.env.MQTT_BROKER_URL || "mqtt://localhost"; 
const USER = process.env.MQTT_USER || 'user';
const PASSWORD = process.env.MQTT_PASSWORD || 'password';

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

client.subscribe('notification')

client.on('message', (topic, payload, packet) => {
    console.log('message')
    if("notification" === topic) {
      try {
        console.log('Notif received.')
        let notification = JSON.parse(payload.toString())

        sendMail(notification).then(result=> console.log('email is sent... ', result)).catch(error=> console.log(error.message))
        console.log('User Email:', notification.email);


        client.publish(`notification/${notification.responseTopic}`, JSON.stringify({status : 200}));

      } catch(err) {
        console.error(err);
      }
}});        
