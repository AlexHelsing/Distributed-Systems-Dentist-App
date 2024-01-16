This service is designed to handle appointments for our dentist application. Patients/users can interact with the service to book, cancel, and view their appointments. The service communicates with dentist and patient API using MQTT for integration. All appointment data is stored in a MongoDB database.

## Features

- Requesting Available Appointment Slots: Users can retrieve information about available appointment slots.
- Booking Appointments: Users can schedule appointments by providing  information such as date and time.
- Canceling Appointments: In case users need to reschedule or cancel their appointments.
- Viewing Appointments: Users can retrieve information about their upcoming and past appointments.

## Technology Stack

- Eclipse Paho MQTT - The service interacts with the REST API using the MQTT.
- MongoDB Database: All appointment data is stored in a MongoDB database.
- Redis Cache: All appointments data is stored in a redis cache for faster fetching of data.
- Java (Gradle for build automation)

## Installation

1. Clone the repository to your machine
2. Build the project with Gradle
3. Configure MQTT settings, including the broker URL and authentication details. (See AppConfigExample file for example config file)
4. Set up MongoDB connection in the configuration.
5. Run the service!


