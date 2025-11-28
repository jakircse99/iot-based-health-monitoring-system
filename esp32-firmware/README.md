# ESP32 Program

This folder contains the **ESP32 code** for the IoT Based Health Monitoring System. The ESP32 was programmed using C/C++ (Arduino IDE). The programs reads all sensor data at specific time intervals and then data formatted into JSON and sent it to **Firebase Realtime Database**. It also triggers the **LED and buzzer** if any dangerous health condition is detected.

## How to Use
1. Open the main sketch (esp32-firmware.ino) in **[Arduino IDE 2.3.6](https://www.arduino.cc/en/software/)**.
2. Go to **Tools → Board → Boards Manager**, search **ESP32**, and click **Install**.
3. Connect your **ESP32 Dev Kit V1** to the computer via USB.
4. Select the correct **board** under **Tools → Board → ESP32 → ESP32 Dev Module**.
5. Select the correct **COM port** under **Tools → Port**.
6. Install all **required libraries** listed below.
7. Add your WiFi & **[Firebase Real-time Database](https://firebase.google.com/docs/database)** credential.
8. **Connect the sensors, LED, and buzzer** to the ESP32 according to the **Hardware Pin Connections** table below.
9. Compile & Upload the code to the ESP32.
10. Open the Serial Monitor at 115200 baud to see live sensor readings and debug the ESP32 if needed.

## Requirements
- ESP32 Development Board
- Arduino IDE
- Firebase Realtime Database
- Connected sensors: Heart Rate & SpO₂, ECG, Body Temperature, Room Temperature & Humidity  
- LED and Buzzer for alerts

## Required Libraries
- **Adafruit Unified Sensor** V1.1.15 by Adafruit (for compatible sensors)
- **DHT sensor library** V1.4.6 by Adafruit (DHT22 sensor)
- **DallasTemperature** V4.0.5 by Miles Burton (DS18B20 sensor)
- **FirebaseClient** V2.2.5 by Mobizt (firebase real-time database)
- **OneWire** V2.3.8 by Jim Studt, Tom Pollard et al. (DS18B20 sensor)
- **SparkFun MAX3010x Sensor Library** V1.1.2 by SparkFun (MAX30102 sensor)

## Hardware Pin Connections

| Component              | Sensor Pin | ESP32 GPIO Pin | Notes                                      |
|------------------------|------------|----------------|--------------------------------------------|
| **MAX30102 Sensor**    | VIN        | 3.3V           | Power supply                               |
|                        | SDA        | D21            | I2C Data                                   |
|                        | SCL        | D22            | I2C Clock                                  |
|                        | GND        | GND            | Ground                                     |
| **AD8232 ECG Sensor**  | GND        | GND            | Ground                                     |
|                        | 3.3V       | 3.3V           | Power supply                               |
|                        | OUTPUT     | VP (GPIO 36)   | Analog ECG signal                          |
|                        | LO MINUS   | D26            | Lead-off detection                         |
|                        | LO PLUS    | D25            | Lead-off detection                         |
| **DS18B20 Sensor**     | VCC        | 3.3V           | Power supply                               |
|                        | DATA       | D4             | 4.7kΩ pull-up resistor to 3.3V required    |
|                        | GND        | GND            | Ground                                     |
| **DHT22 Sensor**       | VCC        | 3.3V           | Power supply                               |
|                        | DATA       | D15            | Digital data pin                           |
|                        | GND        | GND            | Ground                                     |
| **Passive Buzzer**     | VCC        | 3.3V           | Power supply                               |
|                        | I/O        | D27            | Alert output                               |
|                        | GND        | GND            | Ground                                     |
| **Green LED**          | Anode      | D14            | Use current-limiting resistor              |
|                        | Cathode    | GND            | Ground                                     |
| **Red LED**            | Anode      | D13            | Use current-limiting resistor              |
|                        | Cathode    | GND            | Ground                                     |

## Notes
- If the ESP32 COM port is not detected, install the required USB driver (CP2102 or CH340), use a proper data cable, reconnect the board, and restart Arduino IDE.
- Add 4.7k pull up resistor between 3.3V and DATA in DS18B20 Sensor
- If you face code compiling issues, use the given library version or try to debug by yourself or rise a issue.
- Before connecting all sensors together, first test each sensor one by one to ensure it is working properly.
- If you face any issue on ECG measurement then only use DC power supply for ESP32.
- GPIO pins can be changed in the Arduino code if needed.
