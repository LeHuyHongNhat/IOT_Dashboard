#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <math.h>

const char* ssid = "Truong Giang T5";
const char* password = "00000005";
const char* mqtt_server = "192.168.55.31";

unsigned long previousMillis = 0; // Thời gian lưu trữ lần nhấp nháy cuối cùng
const long blinkInterval = 500; 


bool isWarning = false;
const int mqtt_port = 1883;
const char* mqtt_topic = "esp32/sensors";


bool currentLedStatus = false;
bool ledStatus = false;

bool currentAirConditionerStatus = false;
bool airConditionerStatus = false;

bool currentFanStatus = false;
bool fanStatus = false;

bool currentLampStatus = false;
bool lampStatus = false;


WiFiClient espClient;
PubSubClient client(espClient);

#define DHT_PIN 13
#define QUANG_TRO_PIN 34
#define DHTTYPE DHT11
#define LED_PIN 25
#define AIR_CONDITIONER_PIN 26
#define FAN_PIN 27
#define LAMP_PIN 32

DHT dht(DHT_PIN, DHTTYPE);
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

// bool lampBlinking = false;  



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

  if (strcmp(topic, "action/led") == 0) {
    if (strcmp(charMessage, "on") == 0) {
      digitalWrite(LED_PIN, HIGH);
      ledStatus = true;
    } 
    if (strcmp(charMessage, "off") == 0) {
      digitalWrite(LED_PIN, LOW);
      ledStatus = false;
    }
  }

  else if (strcmp(topic, "action/airConditioner") == 0) {
    if (strcmp(charMessage, "on") == 0) {
      digitalWrite(AIR_CONDITIONER_PIN, HIGH);
      airConditionerStatus = true;
    } 
    if (strcmp(charMessage, "off") == 0) {
      digitalWrite(AIR_CONDITIONER_PIN, LOW);
      airConditionerStatus = false;
    }
  }

  else if (strcmp(topic, "action/fan") == 0) {
    if (strcmp(charMessage, "on") == 0) {
      digitalWrite(FAN_PIN, HIGH);
      fanStatus = true;
    } 
    if (strcmp(charMessage, "off") == 0) {
      digitalWrite(FAN_PIN, LOW);
      fanStatus = false;
    }
  }
  else if (strcmp(topic, "action/lamp") == 0) {
    if (strcmp(charMessage, "on") == 0) {
      digitalWrite(LAMP_PIN, HIGH);
      lampStatus = true;
    }
    if (strcmp(charMessage, "off") == 0)
    {
      digitalWrite(LAMP_PIN, LOW);
      lampStatus = false;
    } 
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      client.subscribe("action/led");
      client.subscribe("action/airConditioner");
      client.subscribe("action/fan");
      client.subscribe("action/lamp");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  // sets the pins as outputs:
  Serial.begin(115200);
  dht.begin();
  pinMode(LED_PIN, OUTPUT);
  pinMode(AIR_CONDITIONER_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
  pinMode(LAMP_PIN, OUTPUT);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void checkAndUpdateState() {
  // Kiểm tra và cập nhật trạng thái đèn LED
  if (ledStatus != currentLedStatus) {
    String state = ledStatus ? "on" : "off";
    client.publish("ledOk", state.c_str());
    Serial.print("LED status: ");
    Serial.println(state);
    currentLedStatus = ledStatus;
  }

  // Kiểm tra và cập nhật trạng thái điều hòa
  if (airConditionerStatus != currentAirConditionerStatus) {
    String state = airConditionerStatus ? "on" : "off";
    client.publish("airConditionerOk", state.c_str());
    Serial.print("Air conditioner status: ");
    Serial.println(state);
    currentAirConditionerStatus = airConditionerStatus;
  }

  // Kiểm tra và cập nhật trạng thái quạt
  if (fanStatus != currentFanStatus) {
    String state = fanStatus ? "on" : "off";
    client.publish("fanOk", state.c_str());
    Serial.print("Fan status: ");
    Serial.println(state);
    currentFanStatus = fanStatus;
  }

    if (lampStatus != currentLampStatus) {
    String state = lampStatus ? "on" : "off";
    client.publish("lampOk", state.c_str());
    Serial.print("Lamp status: ");
    Serial.println(state);
    currentLampStatus = lampStatus;
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }

  int humidity = round(dht.readHumidity());
  int temperature = round(dht.readTemperature());
  int light = ceil(analogRead(QUANG_TRO_PIN)/4) + 1;

   int gas = random(0, 1000);

    unsigned long currentMillis = millis();
  if (gas > 800) {
      isWarning = true;  
      digitalWrite(LAMP_PIN,  HIGH );
      delay(200);
      digitalWrite(LAMP_PIN,  LOW);
      delay(200);
       digitalWrite(LAMP_PIN,  HIGH );
      delay(200);
      digitalWrite(LAMP_PIN,  LOW);
      delay(200);
       digitalWrite(LAMP_PIN,  HIGH );
      delay(200);
      digitalWrite(LAMP_PIN,  LOW);
      delay(200);
      digitalWrite(LAMP_PIN,  HIGH );
      delay(200);
      digitalWrite(LAMP_PIN,  LOW);
      delay(200);
      digitalWrite(LAMP_PIN,  HIGH );
      delay(200);
      digitalWrite(LAMP_PIN,  LOW);
      delay(200);
      client.publish("warning", "on");
  } else {
    // Tắt đèn nếu gas trở về mức an toàn
    digitalWrite(LAMP_PIN, LOW);
    isWarning = false;
      client.publish("warning", "off");

  }

 String payload = "{\"temperature\": ";
  payload += temperature;
  payload += ", \"humidity\": ";
  payload += humidity;
  payload += ", \"light\": ";
  payload += light;
  payload += ", \"gas\": ";
  payload += gas;
  payload += "}";
  Serial.println( payload);

  // Gửi dữ liệu lên MQTT
  client.publish(mqtt_topic, payload.c_str());

  client.loop();
  checkAndUpdateState();
  delay(2000);
}