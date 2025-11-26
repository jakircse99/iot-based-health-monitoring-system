/***************************************************
 * IoT Smart Health Monitoring System
 * ---------------------------------
 * Department of Computer Science & Engineering
 * Prime University
 *
 * Description:
 * This ESP32 firmware measure fundamental health parameters including heart rate, SpO₂, body temperature, ECG signal, room temperature and humidity using sensors.
 * The data is transmitted in real-time to Firebase and visualized on web dashboard and Android app.
 * The system includes alerts for abnormal readings to provide quick feedback on the user's health status.
 *
 * Authors:
 * - Jakir Hossain (52nd Evening Batch)
 * Collaborator:
 * - KM Zunayed (55th Evening Batch)
 *
 * Supervisor:
 * - Md. Samrat Ali Abu Kawser (Senior Lecturer)
 *
 * Date: October 20th, 2025
 ***************************************************/
#define ENABLE_USER_AUTH // enable firebase user auth
#define ENABLE_DATABASE // enable firebase database

#include <WiFi.h>
#include <Wire.h>
#include "MAX30105.h"
#include "spo2_algorithm.h"
#include "heartRate.h"
#include <OneWire.h>
#include <DallasTemperature.h>
#include <DHT.h>
#include <WiFiClientSecure.h>
#include <FirebaseClient.h>

/********** GPIO pins **********/
#define PIN_DS18B20 4
#define PIN_DHT22 15
#define DHTTYPE DHT22

#define PIN_AD8232_OUT 36
#define PIN_AD_LOP 25
#define PIN_AD_LOM 26

#define PIN_LED_GREEN 14
#define PIN_LED_RED 13
#define PIN_BUZZER 27

/********** WiFi & firebase configuration **********/
#define WIFI_SSID "YOUR WIFI SSID"
#define WIFI_PASSWORD "YOUR WIFI PASSWORD"
#define DEVICE_ID "device_001"
#define FIREBASE_API_KEY "YOUR FIREBASE API KEY"
#define FIREBASE_DATABASE_URL "YOUR FIREBASE DATABASE URL"
#define USER_EMAIL "YOUR FIREBASE AUTHENCATION EMAIL"
#define USER_PASSWORD "YOUR FIREBASE AUTHENCATION PASSWORD"

/********** sensor objects **********/
MAX30105 particleSensor;
OneWire oneWire(PIN_DS18B20);
DallasTemperature sensorsDS(&oneWire);
DHT dht(PIN_DHT22, DHTTYPE);

/********** firebase objects **********/
UserAuth user_auth(FIREBASE_API_KEY, USER_EMAIL, USER_PASSWORD);
FirebaseApp app;
WiFiClientSecure ssl_client;
using AsyncClient = AsyncClientClass;
AsyncClient async_client(ssl_client);
RealtimeDatabase Database;

/********** MAX30102 heart rate & spo2 variables **********/
bool fingerDetect = false;
unsigned long fingerDetectMillis = 0;
unsigned long lastMaximMillis = 0;
bool initialized = false;
uint32_t irBuffer[100]; 
uint32_t redBuffer[100]; 
int32_t bufferLength = 100; 
int32_t spo2; 
int8_t validSPO2;
int32_t heartRate; 
int8_t validHeartRate;

const byte RATE_SIZE = 10;
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0; // Time at which the last beat occurred
float beatsPerMinute; // current BPM
int avgBeatsPerMinute = 0; // average BPM

/********** alert variables **********/
static unsigned long lastAlertTime = 0;
static bool ledState = false;
static String lastAlertMessage = "";

/********** necessary variables **********/
unsigned long lastPrintMillis = 0;
unsigned long lastSensorMillis = 0;
unsigned long lastFirebaseMillis = 0;

float bodyTemp = 0;
float roomTemp = 0;
float humidity = 0;

/********** healthy range values **********/
const int HR_MIN = 50;
const int HR_MAX = 100;
const int SPO2_MIN = 95;
const float BODY_TEMP_MAX = 37.2;

const float ROOM_TEMP_MIN = 18.0;
const float ROOM_TEMP_MAX = 35.0;

const float HUM_MIN = 20.0;
const float HUM_MAX = 82.0;


/******************** functions ********************/

// ------ heart rate measurement function ------//
void readHeartRate(long irValue) {
    if (checkForBeat(irValue) == true) {
    //We sensed a beat!
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60 / (delta / 1000.0);

    if (beatsPerMinute < 255 && beatsPerMinute > 20) {
      rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array
      rateSpot %= RATE_SIZE; //Wrap variable
      //Take average of readings
      avgBeatsPerMinute = 0;
      for (byte x = 0 ; x < RATE_SIZE ; x++)
        avgBeatsPerMinute += rates[x];
      avgBeatsPerMinute /= RATE_SIZE;

    }
  }
}

// ------ SpO2 measurement function ------//
void readSpo2() {
  // first time buffer initialization, read the first 100 samples, and determine the signal range
  if (!initialized) {
    for (byte i = 0; i < bufferLength; i++) {
      while (particleSensor.available() == false)
      particleSensor.check();

      redBuffer[i] = particleSensor.getRed();
      irBuffer[i] = particleSensor.getIR();
      particleSensor.nextSample();
    }

    // calculate heart rate and SpO2 after first 100 samples (first 4 seconds of samples)
    maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);
    initialized = true;
  }

  // shift old samples and add new ones
  if(millis() - lastMaximMillis > 10000) { // calculate spo2 every 10s
    lastMaximMillis = millis();
    for (byte i = 25; i < 100; i++) { // shift last 75 samples
      redBuffer[i - 25] = redBuffer[i];
      irBuffer[i - 25] = irBuffer[i];
    }

    
    for (byte i = 75; i < 100; i++) { // read new 25 samples
      while (particleSensor.available() == false) particleSensor.check();
  
      redBuffer[i] = particleSensor.getRed();
      irBuffer[i] = particleSensor.getIR();
      particleSensor.nextSample();
    }

    maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);
  }
}

//------ serial print sensor data ------//
void printSensorData(int avgBeatsPerMinute, int spo2, float bodyTemp, float roomTemp, float humidity) {
  Serial.println("------ SENSOR DATA ------");
  Serial.print("Average BPM: "); Serial.println(avgBeatsPerMinute);
  Serial.print("SpO2: "); Serial.print(spo2); Serial.println(" %");
  Serial.print("Body Temp: "); Serial.print(bodyTemp); Serial.println(" °C");
  Serial.print("Room Temp: "); Serial.print(roomTemp); Serial.println(" °C");
  Serial.print("Humidity: "); Serial.print(humidity); Serial.println(" %");
  Serial.println("-------------------------\n");
}

//------ pin mode setup ------//
void setupPins() {
  pinMode(PIN_LED_GREEN, OUTPUT);
  pinMode(PIN_LED_RED, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_AD_LOP, INPUT);
  pinMode(PIN_AD_LOM, INPUT);
}

//------ health abnormal alert function ------//

void checkHealthAlerts(int avgBeatsPerMinute, int spo2, float bodyTemp, float roomTemp, float humidity, bool fingerDetect) {
  bool alert = false;
  String alertMessage = "";

  //heart rate alert
  if (fingerDetect && (millis() - fingerDetectMillis) > 5000) {
    if (avgBeatsPerMinute < HR_MIN || avgBeatsPerMinute > HR_MAX) {
      alert = true;
      alertMessage += "Abnormal heart rate; ";
    }
  }

  //SpO2 alert
  if (fingerDetect && (millis() - fingerDetectMillis) > 5000) {
    if (spo2 < SPO2_MIN) {
      alert = true;
      alertMessage += "Low oxygen level; ";
    }
  }

  //body temperature alert
  if (!isnan(bodyTemp) && (millis() - lastSensorMillis) > 5000) {
    if (bodyTemp > BODY_TEMP_MAX) {
      alert = true;
      alertMessage += "Abnormal body temp; ";
    }
  }

  //room temperature alert
  if (!isnan(roomTemp)) {
    if (roomTemp < ROOM_TEMP_MIN || roomTemp > ROOM_TEMP_MAX) {
      alert = true;
      alertMessage += "Uncomfortable room temp; ";
    }
  }

  // humidity alert
  if (!isnan(humidity)) {
    if (humidity < HUM_MIN || humidity > HUM_MAX) {
      alert = true;
      alertMessage += "Unstable humidity; ";
    }
  }

  // LED + buzzer non-blocking 
  if (alert) {
    if (millis() - lastAlertTime >= 500) {
      lastAlertTime = millis();
      ledState = !ledState;
      digitalWrite(PIN_LED_RED, ledState ? HIGH : LOW);

      if (ledState) tone(PIN_BUZZER, 2000); else noTone(PIN_BUZZER); 
    }
  } else {
    digitalWrite(PIN_LED_RED, LOW);
    noTone(PIN_BUZZER);
  }

  if (alertMessage != lastAlertMessage) {
    lastAlertMessage = alertMessage;
  }
}

/********** main function **********/
void setup() {
  Serial.begin(115200);
  setupPins();
  delay(1000);
  Serial.println("Initializing sensors...");

  /********** MAX30102 sensor init **********/
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30102 sensor not found!");
  }

  particleSensor.setup(); //configure sensor with default settings
  particleSensor.setPulseAmplitudeRed(0x1F); //set Red LED brightness to 0x1F for heart rate detection
  particleSensor.setPulseAmplitudeIR(0x1F); //set IR brightness to 0x1F for SpO2 measurement


  /********** DS18B20 & DHT22 sensor init **********/
  sensorsDS.begin();
  dht.begin();

  Serial.println("All sensors initialized successfully!");

  /********** connect WiFi **********/
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("WiFi Connected!");
  Serial.println(WiFi.localIP());
  digitalWrite(PIN_LED_GREEN, HIGH);

  /********** firebase init **********/
  ssl_client.setInsecure(); // skip certificate verification

  initializeApp(async_client, app, getAuth(user_auth));
  app.getApp<RealtimeDatabase>(Database);
  Database.url(FIREBASE_DATABASE_URL);
}

void loop() {
  
  /********** perform MAX30102 heart rate & SpO2 **********/
  long irValue = particleSensor.getIR();

  if(irValue > 110000) {
    readHeartRate(irValue);
    readSpo2();

    fingerDetect = true;
    fingerDetectMillis = millis();
  } else {
    avgBeatsPerMinute = 0;
    spo2 = 0;
    fingerDetect = false;
    fingerDetectMillis = 0;
  }
  
  /********** read DS18B20 + DHT22 every 5s **********/
  if(millis() - lastSensorMillis >= 5000 || lastSensorMillis == 0) {
    lastSensorMillis = millis();
    sensorsDS.requestTemperatures();
    bodyTemp = sensorsDS.getTempCByIndex(0);

    roomTemp = dht.readTemperature();
    humidity = dht.readHumidity();
  }

  /********** read AD8232 ECG **********/
    int ecgRaw = analogRead(PIN_AD8232_OUT); // 0-4095
    bool leadsOff = (digitalRead(PIN_AD_LOP) == HIGH) || (digitalRead(PIN_AD_LOM) == HIGH); // module sets LO pins high when leads disconnected

  /********** check abnormal health issues **********/
  checkHealthAlerts(avgBeatsPerMinute, spo2, bodyTemp, roomTemp, humidity, fingerDetect);

  /********** print all data in serial monitor every 1s **********/
  if (millis() - lastPrintMillis >= 5000) {
    lastPrintMillis = millis();

    printSensorData(avgBeatsPerMinute, spo2, bodyTemp, roomTemp, humidity);
  }


  /********** send data to firebase **********/
  app.loop();

  if (app.ready() && (millis() - lastFirebaseMillis >= 2000 || lastFirebaseMillis == 0)) {
      lastFirebaseMillis = millis();

      // prepare JSON payload with sensors data
      object_t heart_rate_json, spo2_json, body_temp_json, room_temp_json, humidity_json, ecg_raw_json, leads_off_json, alert_message_json, ts_json, last_active_ts, final_json;
      JsonWriter writer;

      writer.create(heart_rate_json, "heartRate", avgBeatsPerMinute);
      writer.create(spo2_json, "spo2", spo2);
      writer.create(body_temp_json, "bodyTemp", bodyTemp);
      writer.create(room_temp_json, "roomTemp", roomTemp);
      writer.create(humidity_json, "humidity", humidity);
      writer.create(ecg_raw_json, "ecgRaw", ecgRaw);
      writer.create(leads_off_json, "leadsOff", leadsOff);
      writer.create(alert_message_json, "alertMessage", lastAlertMessage);

      // create server timestamp
      writer.create(ts_json, ".sv", "timestamp");
      writer.create(last_active_ts, "lastActive", ts_json);

      // combine sensors data + timestamp
      writer.join(final_json, 9, heart_rate_json, spo2_json, body_temp_json, room_temp_json, humidity_json, ecg_raw_json, leads_off_json, alert_message_json, last_active_ts);
      // send to Firebase
      if (Database.set<object_t>(async_client, "/devices/" DEVICE_ID, final_json)) {
          Serial.println("Firebase data sent successfully!");
      } else {
          Firebase.printf("Firebase set failed, msg: %s, code: %d\n", async_client.lastError().message().c_str(), async_client.lastError().code());
      }
  }
}
