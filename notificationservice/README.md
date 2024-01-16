## Title

Notification service of the denatl system

## Description

This is the notification that will inform the user about their bookings once they make booking. it will subscribe to the notification topic in the mqtt broker and receives the booking information in the payload and will replace them in an email template implemented in html which will then be sent to the person who made the booking
Make sure to run the command npm i to install all the required dependencies 

## Technologies used

- javascript
- node package manager
- node mailer module
- googleapis module

## demonstration

Once an appointment is booked, the user will receive a notification in their gmails with relevant information about the their booking such as the name of the patient, the start and end time of the appointment, the date and a link to the contact support

![image](/src/assets/confirmation.png)