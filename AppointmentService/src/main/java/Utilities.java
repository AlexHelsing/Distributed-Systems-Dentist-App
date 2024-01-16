import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.types.ObjectId;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

import static java.nio.charset.StandardCharsets.UTF_8;

public class Utilities {

    public static String payloadToString(byte[] payload) {
        return new String(payload, UTF_8);
    }

    // Received payload is expected to be a string formatted valid json object of
    // json array.
    public static ArrayList<Appointment> convertToAppointments(String payload) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(payload);

        ArrayList<Appointment> appointments = new ArrayList<>();
        // Creating appointment objects
        if (jsonNode.isArray()) {
            // Last element holds the response_topic
            for (int i = 0; i < jsonNode.size() - 1; i++) {
                Appointment appointment = new Appointment();
                JsonNode element = jsonNode.get(i);

                appointment.setId(new ObjectId());

                String dentistId_string = element.get("dentistId").asText();
                ObjectId dentistId = new ObjectId(dentistId_string);
                appointment.setDentistId(dentistId);
                // Appointment Date
                String dateString = element.get("date").asText();
                LocalDate date = LocalDate.parse(dateString, DateTimeFormatter.ISO_LOCAL_DATE);
                appointment.setDate(date);
                // Appointment Start time
                String startString = element.get("start").asText();
                LocalTime startTime = LocalTime.parse(startString);
                appointment.setStartTime(startTime);
                // Appointment End time
                String endString = element.get("end").asText();
                LocalTime endTime = LocalTime.parse(endString);
                appointment.setEndTime(endTime);

                // set isBooked
                boolean isBooked = element.get("booked").asBoolean(false);
                appointment.setBooked(isBooked);

                // set clinicId
                String clinicId_string = element.get("clinicId").asText();
                ObjectId clinicId = new ObjectId(clinicId_string);
                appointment.setClinicId(clinicId);

                // System.out.println(appointment.toString());

                appointments.add(appointment);
            }
        } else {
            throw new Exception("Received payload is not formatted as an Array.");
        }

        return appointments;
    }

    public static ArrayList<ObjectId> convertToDentistIds(String payload)
            throws JsonMappingException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(payload);

        ArrayList<ObjectId> dentistIds = new ArrayList<>();

        // Last item contains response_topic
        for (int i = 0; i < jsonNode.size() - 1; i++) {
            String id = jsonNode.get(i).asText();
            ObjectId objectId = new ObjectId(id);
            dentistIds.add(objectId);
        }

        return dentistIds;
    }

    public static String extractResponseTopic(String payload) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(payload);

        String responseTopic = "";

        if (jsonNode.isArray()) {
            JsonNode lastElement = jsonNode.get(jsonNode.size() - 1);
            responseTopic = lastElement.get("responseTopic").asText();
        } else {
            responseTopic = jsonNode.get("responseTopic").asText();
        }

        return responseTopic;
    }

    public static String extractPatientId(String payload) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(payload);

        return jsonNode.get("patientId").asText();
    }

    public static String extractClinicId(String payload) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(payload);

        return jsonNode.get("clinicId").asText();
    }

    // TODO: Fix all the mix of camelcase and snakecase.
    public static String extractClinicIdSpecial(String payload) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(payload);

        return jsonNode.get("Clinic").asText();
    }

    public static String extractAppointmentId(String payload) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(payload);

        return jsonNode.get("appointmentId").asText();
    }

    public static String extractDentistId(String payload) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(payload);

        return jsonNode.get("dentistId").asText();
    }

    public static MongoCollection<Appointment> getCollection(MongoClient mongoClient) {
        MongoDatabase database = mongoClient.getDatabase(AppConfig.getMongoDbName()).withCodecRegistry(MqttMain.pojoCodecRegistry);
        return database.getCollection(AppConfig.getMongoDbCollectionName(), Appointment.class);
    }
}
