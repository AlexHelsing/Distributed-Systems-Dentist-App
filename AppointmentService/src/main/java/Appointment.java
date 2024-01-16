import GsonDeserializers.ObjectIdDeserializer;
import MongoDbAdapters.LocalDateTypeAdapter;
import MongoDbAdapters.LocalTimeTypeAdapter;
import MongoDbAdapters.MongoObjectIdTypeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import com.google.gson.annotations.Expose;
import org.bson.types.ObjectId;

import java.time.LocalDate;
import java.time.LocalTime;

public class Appointment {
    @Expose
    private ObjectId _id;
    @Expose
    private ObjectId patientId;
    @Expose
    private ObjectId dentistId;
    @Expose
    private ObjectId clinicId;
    @Expose
    private boolean booked;
    @Expose
    private LocalDate date;
    @Expose
    private LocalTime startTime;
    @Expose
    private LocalTime endTime;

    public Appointment() {
    }

    public Appointment(ObjectId patientId, ObjectId dentistId, ObjectId clinicId, boolean booked, LocalDate date,
            LocalTime startTime, LocalTime endTime) {
        this.patientId = patientId;
        this.dentistId = dentistId;
        this.clinicId = clinicId;
        this.booked = booked;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public ObjectId getPatientId() {
        return patientId;
    }

    public String getPatientIdString(){
        if(patientId == null){
            return null;
        }
        else{
            return patientId.toString();
        }
    }

    public void setPatientId(ObjectId patientId) {
        this.patientId = patientId;
    }

    public ObjectId getDentistId() {
        return dentistId;
    }

    public void setDentistId(ObjectId dentistId) {
        this.dentistId = dentistId;
    }

    public ObjectId getClinicId() {
        return clinicId;
    }

    public void setClinicId(ObjectId clinicId) {
        this.clinicId = clinicId;
    }

    public boolean isBooked() {
        return this.booked;
    }

    public void setBooked(boolean booked) {
        this.booked = booked;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public ObjectId getId() {
        return this._id;
    }

    public void setId(ObjectId id) {
        this._id = id;
    }

    public String toString() {
        return String.format("""
                Patient: %s\s
                Dentist: %s\s
                Clinic: %s\s
                isBooked: %s\s
                Date: %s Starting at: %s Ending at: %s""", getPatientId(), getDentistId(), getClinicId(), isBooked(),
                getDate(),
                getStartTime(),
                getEndTime());
    }

    public String toJSON() {
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.setPrettyPrinting();
        Gson gson = gsonBuilder
                .registerTypeAdapter(ObjectId.class, new MongoObjectIdTypeAdapter())
                .registerTypeAdapter(LocalDate.class, new LocalDateTypeAdapter())
                .registerTypeAdapter(LocalTime.class, new LocalTimeTypeAdapter())
                .registerTypeAdapter(ObjectId.class, new ObjectIdDeserializer())
                .create();
        return gson.toJson(this);
    }
}
