#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <math.h>

// Thông tin kết nối WiFi và MQTT
const char* ssid = "Px0x";
const char* password = "11335577";
const char* mqtt_server = "192.168.0.102";  // Địa chỉ MQTT server
const int mqtt_port = 1883;
const char* mqtt_topic_sensors = "esp32/sensors";
const char* mqtt_topic_led = "esp32/deviceStatus/led";
const char* mqtt_topic_air_conditioner = "esp32/deviceStatus/air_conditioner";
const char* mqtt_topic_fan = "esp32/deviceStatus/fan";

WiFiClient espClient;
PubSubClient client(espClient);

// Định nghĩa các chân kết nối
#define DHT_PIN 13
#define QUANG_TRO_PIN 34
#define DHTTYPE DHT11
#define LED_PIN 25
#define AIR_CONDITIONER_PIN 26
#define FAN_PIN 27

DHT dht(DHT_PIN, DHTTYPE);

unsigned long lastMsg = 0;
const long interval = 2000;  // Khoảng thời gian giữa các lần gửi dữ liệu cảm biến

// Hàm kết nối WiFi
void setup_wifi() {
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

// Hàm gửi trạng thái thiết bị lên MQTT
void publishDeviceStatus() {
  client.publish(mqtt_topic_led, digitalRead(LED_PIN) == HIGH ? "on" : "off");
  client.publish(mqtt_topic_air_conditioner, digitalRead(AIR_CONDITIONER_PIN) == HIGH ? "on" : "off");
  client.publish(mqtt_topic_fan, digitalRead(FAN_PIN) == HIGH ? "on" : "off");
}

// Hàm callback xử lý khi nhận được tin nhắn từ MQTT
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] :");
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);

  char charMessage[length + 1];
  message.toCharArray(charMessage, length + 1);

  // Xử lý tin nhắn điều khiển thiết bị
  if (strcmp(topic, "action/led") == 0) {
    if (strcmp(charMessage, "on") == 0) digitalWrite(LED_PIN, HIGH);
    if (strcmp(charMessage, "off") == 0) digitalWrite(LED_PIN, LOW);
  }

  if (strcmp(topic, "action/air_conditioner") == 0) {
    if (strcmp(charMessage, "on") == 0) digitalWrite(AIR_CONDITIONER_PIN, HIGH);
    if (strcmp(charMessage, "off") == 0) digitalWrite(AIR_CONDITIONER_PIN, LOW);
  }

  if (strcmp(topic, "action/fan") == 0) {
    if (strcmp(charMessage, "on") == 0) digitalWrite(FAN_PIN, HIGH);
    if (strcmp(charMessage, "off") == 0) digitalWrite(FAN_PIN, LOW);
  }

  // Gửi trạng thái thiết bị sau khi thay đổi
  publishDeviceStatus();
}

// Hàm kết nối lại MQTT nếu bị ngắt kết nối
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      client.subscribe("action/led");
      client.subscribe("action/air_conditioner");
      client.subscribe("action/fan");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

// Hàm setup khởi tạo
void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(LED_PIN, OUTPUT);
  pinMode(AIR_CONDITIONER_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

// Vòng lặp chính
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > interval) {
    lastMsg = now;

    // Đọc dữ liệu cảm biến
    int humidity = round(dht.readHumidity());
    int temperature = round(dht.readTemperature());
    int light = ceil(analogRead(QUANG_TRO_PIN)/4) + 1;

    // Tạo chuỗi JSON chứa dữ liệu cảm biến
    String payload = "{\"temperature\": ";
    payload += temperature;
    payload += ", \"humidity\": ";
    payload += humidity;
    payload += ", \"light\": ";
    payload += light;
    payload += "}";
    Serial.println(payload);

    // Gửi dữ liệu lên MQTT
    client.publish(mqtt_topic_sensors, payload.c_str());

    // Gửi trạng thái thiết bị
    publishDeviceStatus();
  }
}
