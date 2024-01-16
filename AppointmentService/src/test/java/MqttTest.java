import org.eclipse.paho.client.mqttv3.IMqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.junit.jupiter.api.Test;
import org.eclipse.paho.client.mqttv3.IMqttAsyncClient;
import static org.mockito.Mockito.*;

import org.mockito.ArgumentMatcher;
import org.mockito.Mockito;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;


public class MqttTest {


    @Test
    public void testPublishMessage() throws MqttException {

        IMqttAsyncClient mockClient = Mockito.mock(IMqttAsyncClient.class);

        String topic = "Dentist/add_appointment_slots/res";
        String message = "Testing";

        byte[] messageByte = message.getBytes();
        MqttMessage mqttMessage = new MqttMessage();

        mqttMessage.setPayload(messageByte);
        mqttMessage.setQos(1);
        mqttMessage.setRetained(false);

        mockClient.publish(topic, mqttMessage);

        verify(mockClient).publish(eq(topic), eq(mqttMessage));
    }

    @Test
    public void testSubscribeToTopic() throws MqttException, InterruptedException {

        IMqttAsyncClient mockClient = Mockito.mock(IMqttAsyncClient.class);

        String topic = "Dentist/add_appointment_slots/res";

        CountDownLatch latch = new CountDownLatch(1);


}}
