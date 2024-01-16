import GsonDeserializers.LocalDateDeserializer;
import GsonDeserializers.LocalTimeDeserializer;
import GsonDeserializers.ObjectIdDeserializer;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.bson.types.ObjectId;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.params.ScanParams;
import redis.clients.jedis.resps.ScanResult;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class AppointmentCache {

    private static final JedisPool jedisPool;
    private final Gson gson;


    static {

        JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxTotal(50);
        poolConfig.setMaxIdle(10);

        // Find host + port name. Standard is below, but change if needed and add too AppConfig.
        jedisPool = new JedisPool(poolConfig, "127.0.0.1", 6379);
    }

    public AppointmentCache() {
        GsonBuilder gsonBuilder = new GsonBuilder()
                .excludeFieldsWithoutExposeAnnotation()
                .registerTypeAdapter(ObjectId.class, new ObjectIdDeserializer())
                .registerTypeAdapter(LocalDate.class, new LocalDateDeserializer())
                .registerTypeAdapter(LocalTime.class, new LocalTimeDeserializer());
        this.gson = gsonBuilder.create();
    }

    public List<Appointment> getClinicAppointments(String clinicId) {
        try (Jedis jedis = jedisPool.getResource()) {
            String keyPattern = "appointment:" + clinicId + ":booked:false:id:*:pid:*";
            Set<String> keys = jedis.keys(keyPattern);

            if (!keys.isEmpty()) {
                return keys.stream()
                        .map(key -> gson.fromJson(jedis.get(key), Appointment.class))
                        .collect(Collectors.toList());
            } else {
                return Collections.emptyList();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // In case of error it returns an empty list for now.
        return Collections.emptyList();
    }

    public List<Appointment> getPatientAppointments(String patientId) {
        try (Jedis jedis = jedisPool.getResource()) {
            String keyPattern = "appointment:*:booked:*:id:*:pid:" + patientId;
            Set<String> keys = jedis.keys(keyPattern);
            if (!keys.isEmpty()) {
                return keys.stream()
                        .map(key -> gson.fromJson(jedis.get(key), Appointment.class))
                        .collect(Collectors.toList());
            } else {
                return Collections.emptyList();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // In case of error it returns an empty list for now.
        return Collections.emptyList();
    }


    public void cacheAppointment(Appointment appointment, String clinicId) {
        try (Jedis jedis = jedisPool.getResource()) {
            String appointmentJson = appointment.toJSON();
            String key = String.format("appointment:%s:booked:%b:id:%s:pid:%s",
                    clinicId,
                    appointment.isBooked(),
                    appointment.getId().toString(),
                    appointment.getPatientIdString());
            jedis.set(key, appointmentJson);
            //System.out.println("Cached appointment " + appointment.getId().toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Use for eventual deletion from cache.. The reason it returns a long is because of jedis.del function
    public void removeFromCache(Appointment appointment){
        try(Jedis jedis = jedisPool.getResource()) {
            String appointmentJson = appointment.toJSON();
            String key = "appointment:" + appointment.getClinicId() + ":booked:*:id:" + appointment.getId();
            jedis.del(key);
        }
        catch (Exception e){
            e.printStackTrace();
        }
    }

    public void updateCache(Appointment updatedAppointment, String clinicId, String appointmentId) {
        try (Jedis jedis = jedisPool.getResource()) {
            // Remove the old cache entry
            String oldKeyPattern = "appointment:" + clinicId + ":booked:*:id:" + appointmentId + ":pid:*";
            Set<String> oldKeys = jedis.keys(oldKeyPattern);
            for (String oldKey : oldKeys) {
                jedis.del(oldKey);
            }
            // We add the new cache entry with new "booked" field status
            String newKey = String.format("appointment:%s:booked:%b:id:%s:pid:%s",
                    clinicId,
                    updatedAppointment.isBooked(),
                    appointmentId,
                    updatedAppointment.getPatientIdString());
            String updatedJson = updatedAppointment.toJSON();
            //System.out.println("Updated cache with appointment: " + updatedAppointment.getId().toString());
            jedis.set(newKey, updatedJson);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}

