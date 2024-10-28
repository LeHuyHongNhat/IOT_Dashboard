#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <math.h>

// WiFi và MQTT config
const char* ssid = "Px0x";
const char* password = "11335577";
const char* mqtt_server = "192.168.0.100";
const int mqtt_port = 1995;
const char* mqtt_username = "lehuyhongnhat";
const char* mqtt_password = "b21dccn575";

// MQTT topics
const char* mqtt_topic_sensors = "esp32/sensors";
const char* mqtt_topic_led = "esp32/deviceStatus/led";
const char* mqtt_topic_air_conditioner = "esp32/deviceStatus/air_conditioner";
const char* mqtt_topic_fan = "esp32/deviceStatus/fan";
const char* mqtt_topic_gas = "esp32/deviceStatus/gas";

// Pin definitions
#define DHT_PIN 13
#define QUANG_TRO_PIN 34
#define DHTTYPE DHT11
#define LED_PIN 25
#define AIR_CONDITIONER_PIN 26
#define FAN_PIN 27
#define GAS_PIN 33

// Timing constants
const unsigned long SENSOR_INTERVAL = 2000;  // 2 seconds
const unsigned long WARNING_INTERVAL = 500;   // 0.5 seconds

// Global variables
WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHT_PIN, DHTTYPE);
unsigned long lastSensorRead = 0;
unsigned long lastWarningBlink = 0;
bool gasWarningState = false;
int currentGasValue = 0;

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

void publishDeviceStatus() {
  client.publish(mqtt_topic_led, digitalRead(LED_PIN) == HIGH ? "on" : "off");
  client.publish(mqtt_topic_air_conditioner, digitalRead(AIR_CONDITIONER_PIN) == HIGH ? "on" : "off");
  client.publish(mqtt_topic_fan, digitalRead(FAN_PIN) == HIGH ? "on" : "off");
  client.publish(mqtt_topic_gas, digitalRead(GAS_PIN) == HIGH ? "on" : "off");
}

void handleDeviceControl(const char* topic, const char* message) {
  int pin = -1;
  
  if (strcmp(topic, "action/led") == 0) pin = LED_PIN;
  else if (strcmp(topic, "action/air_conditioner") == 0) pin = AIR_CONDITIONER_PIN;
  else if (strcmp(topic, "action/fan") == 0) pin = FAN_PIN;
  else if (strcmp(topic, "action/gas") == 0) pin = GAS_PIN;
  
  if (pin != -1) {
    if (strcmp(message, "on") == 0) digitalWrite(pin, HIGH);
    else if (strcmp(message, "off") == 0) digitalWrite(pin, LOW);
    publishDeviceStatus();
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] :");
  
  char message[length + 1];
  memcpy(message, payload, length);
  message[length] = '\0';
  
  Serial.println(message);
  handleDeviceControl(topic, message);
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client", mqtt_username, mqtt_password)) {
      Serial.println("connected");
      client.subscribe("action/led");
      client.subscribe("action/air_conditioner");
      client.subscribe("action/fan");
      client.subscribe("action/gas");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void handleGasWarning() {
  if (currentGasValue > 70) { // Nếu gas vượt ngưỡng 70%
    unsigned long currentMillis = millis();
    if (currentMillis - lastWarningBlink >= WARNING_INTERVAL) {
      lastWarningBlink = currentMillis;
      gasWarningState = !gasWarningState;
      digitalWrite(GAS_PIN, gasWarningState);
    }
  } else {
    digitalWrite(GAS_PIN, LOW);
    gasWarningState = false;
  }
}

int getRandomGas() {
  // Đảm bảo giá trị gas từ 0-100
  return random(0, 101); // random(min, max) trả về giá trị từ min đến (max-1)
}

void readAndPublishSensors() {
  unsigned long currentMillis = millis();
  if (currentMillis - lastSensorRead >= SENSOR_INTERVAL) {
    lastSensorRead = currentMillis;

    int humidity = round(dht.readHumidity());
    int temperature = round(dht.readTemperature());
    int light = ceil(analogRead(QUANG_TRO_PIN)/4) + 1;
    currentGasValue = getRandomGas(); // Sử dụng hàm riêng để lấy giá trị gas

    // Đảm bảo các giá trị hợp lệ
    humidity = constrain(humidity, 0, 100);
    temperature = constrain(temperature, -40, 80); // Giới hạn nhiệt độ hợp lý
    light = constrain(light, 0, 1200);
    
    String payload = "{\"temperature\": " + String(temperature) +
                    ", \"humidity\": " + String(humidity) +
                    ", \"light\": " + String(light) +
                    ", \"gas\": " + String(currentGasValue) + "}";
    
    Serial.println(payload);
    client.publish(mqtt_topic_sensors, payload.c_str());
    publishDeviceStatus();
  }
}

void setup() {
  Serial.begin(115200);
  
  // Initialize pins
  pinMode(LED_PIN, OUTPUT);
  pinMode(AIR_CONDITIONER_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
  pinMode(GAS_PIN, OUTPUT);
  
  // Khởi tạo seed cho random từ analog noise
  randomSeed(analogRead(0));
  
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  handleGasWarning();
  readAndPublishSensors();
}