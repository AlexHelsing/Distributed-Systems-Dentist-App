import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import com.mongodb.client.model.ReturnDocument;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.InsertManyResult;
import org.bson.Document;
import org.bson.codecs.configuration.CodecProvider;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.eclipse.paho.client.mqttv3.*;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static com.mongodb.MongoClientSettings.getDefaultCodecRegistry;
import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

public class MqttMain {

    // MQTT Connection
    static String MqttURI = AppConfig.getMqttUri();
    static String MqttUsername = AppConfig.getMqttUsername();
    static String MqttPassword = AppConfig.getMqttPassword();

    // TOPICS
    static String dentistAddAppointmentSlot = "Dentist/post_slots/req";
    static String deleteDentistAppointments = "Clinic/delete_dentist/req";
    static String clinicGetAppointments = "Clinic/get_appointments/req";
    static String patientMakeAppointment = "Patient/make_appointment/req";
    static String patientGetAppointments = "Patient/get_appointments/req";
    static String patientCancelAppointment = "Patient/cancel_appointment/req";

    static String dentistGetAppointmentSlots = "Dentist/get_appointments/req";
    static String dentistCancelAppointment = "Dentist/cancel_appointment/req";

    // Codec
    static CodecProvider pojoCodecProvider = PojoCodecProvider.builder().automatic(true).build();
    static CodecRegistry pojoCodecRegistry = fromRegistries(getDefaultCodecRegistry(),
            fromProviders(pojoCodecProvider));

    public static void main(String[] args) throws MqttException {

        ExecutorService service = Executors.newFixedThreadPool(10);
        // setting the Mqtt connection
        MqttClient client = new MqttClient(
                MqttURI, // serverURI in format:
                // "protocol://name:port"
                MqttClient.generateClientId(), // ClientId
                new MemoryPersistence()); // Persistence

        MqttConnectOptions mqttConnectOptions = new MqttConnectOptions();
        mqttConnectOptions.setUserName(MqttUsername);
        mqttConnectOptions.setPassword(MqttPassword.toCharArray());
        // using the default socket factory
        // mqttConnectOptions.setSocketFactory(SSLSocketFactory.getDefault());
        client.connect(mqttConnectOptions);

        client.setCallback(new MqttCallback() {
            @Override
            // Called when the client lost the connection to the broker
            public void connectionLost(Throwable cause) {
                System.out.println("client lost connection " + cause);
            }

            @Override
            public void messageArrived(String topic, MqttMessage message) {
                // All messageArrived can be found in the subscriptions below.
            }

            @Override
            // Called when an outgoing publish is complete
            public void deliveryComplete(IMqttDeliveryToken token) {
                System.out.println("delivery complete " + token);
            }
        });

        // Setting the DB connection
        MongoClient mongoClient = MongoClients.create(AppConfig.getMongodbUri());
        MongoCollection<Appointment> collection = Utilities.getCollection(mongoClient);
        AppointmentCache appointmentCache = new AppointmentCache();

        // Patient Subscriptions
        client.subscribe(patientMakeAppointment, 1, (topic, message) -> service.submit(() -> {
            String payload = Utilities.payloadToString(message.getPayload());
            System.out.println("Received message on " + topic + " \nMessage: " + payload);
            try {
                String patient_id = Utilities.extractPatientId(payload);
                String responseTopic = Utilities.extractResponseTopic(payload);
                String appointment_id = Utilities.extractAppointmentId(payload);
                String mqttResponseTopic = String.format("Patient/%s/make_appointment/res", responseTopic);

                try{
                    Document query = new Document("_id", new ObjectId(appointment_id));
                    Appointment appointment = collection.find(query).first();
                    assert appointment != null;
                    if(appointment.isBooked()){
                        String result = new Result(409, "Appointment is already booked").toJSON();
                        byte[] bookedMessage = result.getBytes();
                        MqttMessage publishMessage = new MqttMessage(bookedMessage);
                        client.publish(mqttResponseTopic, publishMessage);
                    } else{
                        // Booking the appointment
                        Document queryBooking = new Document("_id", new ObjectId(appointment_id));
                        Document update = new Document("$set", new Document("patientId", new ObjectId(patient_id))
                                .append("booked", true));
                        FindOneAndUpdateOptions options = new FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER);
                        Appointment updatedDocument = collection.findOneAndUpdate(queryBooking, update, options);

                        if (updatedDocument != null) {
                            //System.out.println(" New document is: " +updatedDocument);
                            String clinic_id = String.valueOf(updatedDocument.getClinicId());
                            appointmentCache.updateCache(updatedDocument, clinic_id, appointment_id);
                            String result = new Result(200, "Appointment was booked").toJSON();
                            byte[] bookedMessage = result.getBytes();
                            MqttMessage publishMessage = new MqttMessage(bookedMessage);
                            client.publish(mqttResponseTopic, publishMessage);
                        }
                        if (appointment.isBooked()) {
                            byte[] messagePayload = new Result(409, "Appointment is already booked").toJSON()
                                    .getBytes();
                            MqttMessage publishMessage = new MqttMessage(messagePayload);
                            client.publish(mqttResponseTopic, publishMessage);
                            return;
                        }
                        else{
                            byte[] messagePayload = new Result(404, "Appointment with given id was not found.").toJSON()
                                    .getBytes();
                            MqttMessage publishMessage = new MqttMessage(messagePayload);
                            client.publish(mqttResponseTopic, publishMessage);
                        }
                    }} catch (Exception e) {
                    throw new RuntimeException(e);
                }
                // Booking the appointment
                Document query = new Document("_id", new ObjectId(appointment_id));
                Document update = new Document("$set", new Document("patientId", new ObjectId(patient_id))
                        .append("booked", true));
                FindOneAndUpdateOptions options = new FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER);
                Appointment updatedDocument = collection.findOneAndUpdate(query, update, options);

                if (updatedDocument != null) {
                    String result = new Result(201, "Appointment was booked", updatedDocument).toJSON();
                    byte[] bookedMessage = result.getBytes();
                    MqttMessage publishMessage = new MqttMessage(bookedMessage);
                    client.publish(mqttResponseTopic, publishMessage);
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            }));
        client.subscribe(patientGetAppointments, 1, (topic, message) -> service.submit(() -> {
            String payload = Utilities.payloadToString(message.getPayload());
            System.out.println("Received message on " + topic + " \nMessage: " + payload);
            try {
                // Parse and query database with the patientId string in payload text
                String patient_id = Utilities.extractPatientId(payload);
                String response_topic = Utilities.extractResponseTopic(payload);

                List<Appointment> matchingAppointmentsCache = appointmentCache.getPatientAppointments(patient_id);

                if(matchingAppointmentsCache.isEmpty()){
                    //System.out.println("Fetching patient data from mongoDb..");
                    ArrayList<Appointment> matchingAppointmentsDb = new ArrayList<>();
                    Document query = new Document("patientId", new ObjectId(patient_id));
                    collection.find(query).into(matchingAppointmentsDb);
                    // Find and add all the matches of the query to docJsonList
                    for (Appointment doc : matchingAppointmentsDb) {
                    appointmentCache.cacheAppointment(doc, doc.getClinicId().toHexString());
                    //System.out.println("Added doc to cache");
                    }
                    ArrayList<String> jsonAppointments = new ArrayList<>();
                    for (Appointment appointment : matchingAppointmentsDb) {
                    String jsonAppointment = appointment.toJSON();
                    jsonAppointments.add(jsonAppointment);
                    }
                    // Create Json format, format to MQTT message and publish to response topic
                    String jsonArray = "[" + String.join(",", jsonAppointments) + "]";
                    String mqttResponseTopic = String.format("Patient/%s/get_appointments/res", response_topic);
                    byte[] messagePayload = jsonArray.getBytes();
                    MqttMessage publishMessage = new MqttMessage(messagePayload);
                    client.publish(mqttResponseTopic, publishMessage);
                    return;
                    }

                //System.out.println("Patient data from cache");
                ArrayList<String> jsonAppointments = new ArrayList<>();
                for (Appointment appointment : matchingAppointmentsCache) {
                    String jsonAppointment = appointment.toJSON();
                    jsonAppointments.add(jsonAppointment);
                }
                // Create Json format, format to MQTT message and publish to response topic
                String jsonArray = "[" + String.join(",", jsonAppointments) + "]";
                String mqttResponseTopic = String.format("Patient/%s/get_appointments/res", response_topic);
                byte[] messagePayload = jsonArray.getBytes();
                MqttMessage publishMessage = new MqttMessage(messagePayload);
                client.publish(mqttResponseTopic, publishMessage);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }));
        client.subscribe(patientCancelAppointment, 1, (topic, message) -> service.submit(() -> {
            String payload = Utilities.payloadToString(message.getPayload());
            System.out.println("Received message on " + topic + " \nMessage: " + payload);
            try {

                String appointment_id = Utilities.extractAppointmentId(payload);
                String response_topic = Utilities.extractResponseTopic(payload);

                Bson filter = Filters.eq("_id", new ObjectId(appointment_id));
                Appointment appointment = collection.find(filter).first();

                if (appointment == null) {
                    String result = new Result(404, "Appointment with given id was not found.").toJSON();
                    MqttMessage publishMessage = new MqttMessage(result.getBytes());
                    String mqttResponseTopic = String.format("Patient/%s/cancel_appointment/res", response_topic);
                    client.publish(mqttResponseTopic, publishMessage);
                    return;
                }
                if(!appointment.isBooked()) {
                    String result = new Result(409, "Appointment with given id has already been cancelled.").toJSON();
                    MqttMessage publishMessage = new MqttMessage(result.getBytes());
                    String mqttResponseTopic = String.format("Patient/%s/cancel_appointment/res", response_topic);
                    client.publish(mqttResponseTopic, publishMessage);
                    return;
                }
                Document query = new Document("_id", new ObjectId(appointment_id));
                Document update = new Document("$set", new Document("patientId", null)
                        .append("booked", false));
                FindOneAndUpdateOptions options = new FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER);
                Appointment updatedDocument = collection.findOneAndUpdate(query, update, options);

                if (updatedDocument != null) {
                    String clinic_id = String.valueOf(updatedDocument.getClinicId());
                    appointmentCache.updateCache(updatedDocument, clinic_id, appointment_id);
                    String result = new Result(200, "Appointment was cancelled").toJSON();
                    MqttMessage publishMessage = new MqttMessage(result.getBytes());
                    String mqttResponseTopic = String.format("Patient/%s/cancel_appointment/res", response_topic);
                    client.publish(mqttResponseTopic, publishMessage);
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }));
        // Dentist subscriptions
        client.subscribe(dentistAddAppointmentSlot, 1, (topic, message) -> service.submit(() -> {
            String payload = Utilities.payloadToString(message.getPayload());
            try {
                // Read from JSON and create a POJO object to insert to database
                ArrayList<Appointment> appointments = Utilities.convertToAppointments(payload);
                String responseTopic = Utilities.extractResponseTopic(payload);

                // Insert to database
                InsertManyResult newAppointments = collection.insertMany(appointments);

                // If insertion is acknowledged, publish to response topic
                if (newAppointments.wasAcknowledged()) {
                    for (Appointment appointment : appointments) {
                        appointmentCache.cacheAppointment(appointment, appointment.getClinicId().toString());
                    }
                    String mqttResponseTopic = String.format("Dentist/%s/post_slots/res", responseTopic);

                    Result result = new Result(201, "Appointment slots were added successfully.");
                    String resPayload = result.toJSON();
                    byte[] resPayloadBytes = resPayload.getBytes();
                    MqttMessage response = new MqttMessage(resPayloadBytes);

                    client.publish(mqttResponseTopic, response);
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }));
        // Dentist appointment slots
        client.subscribe(dentistGetAppointmentSlots, 1, (topic, message) -> service.submit(() -> {
            String payload = Utilities.payloadToString(message.getPayload());
            System.out.println("Received message on " + topic + " \nMessage: " + payload);
            try {
                String responseTopic = Utilities.extractResponseTopic(payload);
                ObjectId dentist_id = new ObjectId(Utilities.extractDentistId(payload));

                System.out.println("responseTopic" + responseTopic);

                Bson filter = Filters.eq("dentistId", dentist_id);
                ArrayList<Appointment> patientAppointments = collection.find(filter).into(new ArrayList<>());
                // If insertion is acknowledged, publish to response topic
                ArrayList<String> jsonAppointments = new ArrayList<>();
                for (Appointment appointment : patientAppointments) {
                    String jsonAppointment = appointment.toJSON();
                    jsonAppointments.add(jsonAppointment);
                }

                String resPayload = "[" + String.join(",", jsonAppointments) + "]";

                String mqttResponseTopic = String.format("Dentist/%s/get_appointments/res", responseTopic);
                byte[] messagePayload = resPayload.getBytes();
                MqttMessage publishMessage = new MqttMessage(messagePayload);

                client.publish(mqttResponseTopic, publishMessage);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }));
        client.subscribe(dentistCancelAppointment, 1, (topic, message) -> service.submit(() -> {
            String payload = Utilities.payloadToString(message.getPayload());
            System.out.println("Received message on " + topic + " \nMessage: " + payload);
            try {
                String responseTopic = Utilities.extractResponseTopic(payload);
                ObjectId appointment_id = new ObjectId(Utilities.extractAppointmentId(payload));

                Bson filter = Filters.eq("_id", appointment_id);
                Appointment appointment = collection.find(filter).first();

                if (appointment == null) {
                    String mqttResponseTopic = String.format("Dentist/%s/cancel_appointment/res", responseTopic);
                    byte[] messagePayload = new Result(404, "Appointment with given id was not found").toJSON()
                            .getBytes();
                    MqttMessage publishMessage = new MqttMessage(messagePayload);
                    client.publish(mqttResponseTopic, publishMessage);
                    return;
                }

                if (!appointment.isBooked()) {
                    String mqttResponseTopic = String.format("Dentist/%s/cancel_appointment/res", responseTopic);
                    byte[] messagePayload = new Result(409, "Appointment with given is not booked").toJSON().getBytes();
                    MqttMessage publishMessage = new MqttMessage(messagePayload);
                    client.publish(mqttResponseTopic, publishMessage);
                    return;
                }

                String patient_id = appointment.getPatientId().toString();
                Document query = new Document("_id", appointment_id);
                Document update = new Document("$set", new Document("patientId", null)
                        .append("booked", false));
                FindOneAndUpdateOptions options = new FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER);
                Appointment updatedDocument = collection.findOneAndUpdate(query, update, options);

                System.out.println("updatedDocument: " + updatedDocument);

                if (updatedDocument != null) {
                    appointmentCache.updateCache(updatedDocument, updatedDocument.getClinicId().toString(), String.valueOf(appointment_id));
                    String mqttResponseTopic = String.format("Dentist/%s/cancel_appointment/res", responseTopic);
                    byte[] messagePayload = new Result(200, "Appointment was cancelled successfully", appointment).toJSON().getBytes();
                    MqttMessage publishMessage = new MqttMessage(messagePayload);
                    client.publish(mqttResponseTopic, publishMessage);
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }));
        // Clinic subscriptions
        client.subscribe(clinicGetAppointments, 1, (topic, message) -> service.submit(() -> {
            String payload = Utilities.payloadToString(message.getPayload());
            System.out.println("Received message on " + topic + " \nMessage: " + payload);
            try {
                String clinicId = Utilities.extractClinicId(payload);
                String responseTopic = Utilities.extractResponseTopic(payload);

                List<Appointment> matchingAppointmentsCache = appointmentCache.getClinicAppointments(clinicId);

                if(matchingAppointmentsCache.isEmpty()) {
                    // TODO: Make a method out of this for readability in the future. Looks like dogshit now
                    //System.out.println("Get from mongoDB instead");
                    // GET DATA FROM MONGODB INSTEAD
                    ArrayList<Appointment> matchingAppointmentsDB = new ArrayList<>();

                    LocalDate today = LocalDate.now(); // Or specify the date you want
                    ZoneId defaultZoneId = ZoneId.systemDefault();
                    Instant instant = today.atStartOfDay(defaultZoneId).toInstant();
                    Date queryDate = Date.from(instant);
                    // Query Appointments based on clinicId
                    Bson dateFilter = Filters.gt("date", queryDate);
                    Bson clinicIdFilter = Filters.in("clinicId", new ObjectId(clinicId));
                    Bson isBookedFilter = Filters.eq("booked", false);
                    Bson combinedFilter = Filters.and(clinicIdFilter, isBookedFilter, dateFilter);

                    collection.find(combinedFilter).into(matchingAppointmentsDB);
                    // CACHE THE DATA TO REDIS
                    for (Appointment appointment : matchingAppointmentsDB) {
                        appointmentCache.cacheAppointment(appointment, clinicId);
                        //System.out.println("Caching..");
                    }
                    ArrayList<String> jsonAppointments = new ArrayList<>();
                    for (Appointment appointment : matchingAppointmentsDB) {
                        String jsonAppointment = appointment.toJSON();
                        jsonAppointments.add(jsonAppointment);
                    }

                    Result result = new Result(200, "Appointments were retrieved successfully.");
                    String resultJson = result.toJSON();

                    String resPayload;
                    if (jsonAppointments.isEmpty()) {
                        resPayload = "[" + resultJson + "]";
                    } else {
                        resPayload = "[" + String.join(", ", jsonAppointments) + "," + resultJson + "]";
                    }

                    String mqttResponseTopic = String.format("Clinic/%s/get_appointments/res", responseTopic);
                    byte[] messagePayload = resPayload.getBytes();
                    MqttMessage publishMessage = new MqttMessage(messagePayload);
                    client.publish(mqttResponseTopic, publishMessage);
                    return;
                }
                else {
                    //System.out.println("Fetching from redis cache");
                    // If found in cache, we do below code.
                    // Structure payload as an array of JSONs
                    ArrayList<String> jsonAppointments = new ArrayList<>();
                    for (Appointment appointment : matchingAppointmentsCache) {
                        String jsonAppointment = appointment.toJSON();
                        jsonAppointments.add(jsonAppointment);
                    }
                    Result result = new Result(200, "Appointments were retrieved successfully.");
                    String resultJson = result.toJSON();

                    String resPayload;
                    resPayload = "[" + String.join(", ", jsonAppointments) + "," + resultJson + "]";

                    String mqttResponseTopic = String.format("Clinic/%s/get_appointments/res", responseTopic);
                    byte[] messagePayload = resPayload.getBytes();
                    MqttMessage publishMessage = new MqttMessage(messagePayload);
                    client.publish(mqttResponseTopic, publishMessage);
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }));

        client.subscribe(deleteDentistAppointments, 1, (topic, message) -> service.submit(() -> {
            String payload = Utilities.payloadToString(message.getPayload());
            System.out.println("Received message on " + topic + " \nMessage: " + payload);
            try {
                String responseTopic = Utilities.extractResponseTopic(payload);
                ObjectId dentist_id = new ObjectId(Utilities.extractDentistId(payload));

                Bson filter = Filters.eq("dentistId", dentist_id);
                DeleteResult result = collection.deleteMany(filter);
                if (result.wasAcknowledged()) {
                    String mqttResponseTopic = String.format("Clinic/%s/delete_dentist/res", responseTopic);
                    byte[] resPayloadBytes = new Result(200, "Appointments were deleted successfully.").toJSON()
                            .getBytes();
                    MqttMessage response = new MqttMessage(resPayloadBytes);
                    client.publish(mqttResponseTopic, response);
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }));
    }
}
