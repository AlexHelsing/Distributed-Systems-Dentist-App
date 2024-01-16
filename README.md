### Why have we built this application?

Our teeth are one of our most precious tools. We often don’t appreciate them enough until we lose them, for instance due to bad dental care. 
Doing annual checks with a dentist is therefore recommended. For someone moving to Sweden, or within Sweden, it is not always easy to get a dentist appointment as many practices are working on full capacity already and will reject you as a new care-taker.
As a consequence, as of today, you are required to do a manual search online, and additional time-taking calls with little chance of success.

### Dentist Application

We have created a dentist app where users can fetch, book and cancel appointments in the city they wish. When users search for appointments in a city of their choosing, the clinics are displayed on a map as well to help with seeing which one is closest to their own location.
The application is built with microservices architecture in mind. The different services are loosely coupled, and can be scaled easily by running more instances. 

### Technologies used

- Typescript/Javascript for REST API's and frontend.
- Vue.js and Tailwind for frontend.
- Java for appointment service.
- MongoDb for storing user data, clinic data and appointment data.
- Redis Cache for faster fetching of data.
- WebSockets (Pusher) for updating data in real-time. (When an appointment is booked, it will disappear for all other customers without needing to refresh)
- MQTT for communication between some services.

See how the system works by checking out the diagrams at the bottom of the page.

### Preview of app

![image](https://i.imgur.com/qMcyUVp.png)

![image](https://i.imgur.com/kXO8Ajh.png)

![image](https://i.imgur.com/PF5U1QT.png)

![image](https://i.imgur.com/ptlKkkF.png)

![image](https://i.imgur.com/p1YLVdx.png)

![image](https://i.imgur.com/b4YoasK.png)

![image](https://i.imgur.com/DwPSCz1.png)


# Diagrams

## Component Diagram
![image](https://i.imgur.com/XGZ71uz.png)
## Sequence Diagram - From login to booking an appointment
![image](https://i.imgur.com/sxKhZLG.png)
