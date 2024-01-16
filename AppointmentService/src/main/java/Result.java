import MongoDbAdapters.LocalDateTypeAdapter;
import MongoDbAdapters.LocalTimeTypeAdapter;
import MongoDbAdapters.MongoObjectIdTypeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.bson.types.ObjectId;

import java.time.LocalDate;
import java.time.LocalTime;

public class Result {
    public  Result() {}

    public Result(int status, String message) {
        this.message = message;
        this.status = status;
    }

    public Result(int status, String message, Appointment appointment) {
       this.status = status;
       this.message = message;
       this.patientId = appointment.getPatientId();
       this.dentistId = appointment.getDentistId();
       this.date = appointment.getDate();
       this.startTime = appointment.getStartTime();
       this.endTime = appointment.getEndTime();
    }

    private ObjectId patientId;
    private ObjectId dentistId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private int status;
    private String message;

    public int getStatus() {
        return this.status;
    }

    public  String getMessage() {
        return this.message;
    }
    public void setStatus(int status) {
        this.status = status;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "Status: " + this.status + ", " + "Message: " + this.message;
    }
    public String toJSON() {
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.setPrettyPrinting();
        Gson gson = gsonBuilder
                .registerTypeAdapter(ObjectId.class, new MongoObjectIdTypeAdapter())
                .registerTypeAdapter(LocalDate.class, new LocalDateTypeAdapter())
                .registerTypeAdapter(LocalTime.class, new LocalTimeTypeAdapter())
                .create();
        return gson.toJson(this);
    }

    public ObjectId getPatientId() {
        return patientId;
    }

    public ObjectId getDentistId() {
        return dentistId;
    }

    public LocalDate getDate() {
        return date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }
}
