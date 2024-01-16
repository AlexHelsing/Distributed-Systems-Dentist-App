public class AppConfigExample {

    // Rename to AppConfig.java and enter usernames and password to below fields
    private static final String MONGODB_URI ="mongodb+srv://<username>:<password>@cluster0.qlrcbzs.mongodb.net/?retryWrites=true&w=majority";
    private static final String MQTT_URI = "<mqttUri>";

    private static final String MQTT_USERNAME = "<username>";

    private static final String MQTT_PASSWORD = "<password>";

    private static final String DATABASE_NAME = "<DBNAME>";

    private static final String COLLECTION_NAME = "<COLLECTIONNAME>";


    public static String getMongodbUri(){
        return MONGODB_URI;
    }
    public static String getMqttUri(){
        return MQTT_URI;
    }
    public static String getMqttUsername(){
        return MQTT_USERNAME;
    }
    public static String getMqttPassword(){
        return MQTT_PASSWORD;
    }

    public static String getMongoDbName(){
        return DATABASE_NAME;
    }

    public static String getMongoDbCollectionName(){
        return COLLECTION_NAME;
    }

}
