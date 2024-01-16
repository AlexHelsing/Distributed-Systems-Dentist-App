package GsonDeserializers;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import org.bson.types.ObjectId;

import java.lang.reflect.Type;

public class ObjectIdDeserializer implements JsonDeserializer<ObjectId> {

    @Override
    public ObjectId deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
            return new ObjectId(json.getAsString());
    }
}