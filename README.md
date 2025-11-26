# IoT-Based Health Monitoring System
This is an IoT-based health monitoring system that measures heart rate, SpO₂, ECG, body temperature, and environmental conditions in real time. The system also activates an LED and buzzer alert whenever it detects dangerous health conditions, and all data monitored through a cloud web dashboard and mobile app.

## Introduction
The Internet of Things (IoT) has become an important part of modern technology, especially in the healthcare sector. This project focuses on building an IoT-based health monitoring system that can monitor a patient’s health condition in real time. The system collects different health parameters and sends the data to a cloud server. The data can be viewed using a web dashboard and a mobile application, which allows doctors and patients to monitor health conditions from anywhere.

## Project Objectives
- To design a real-time health monitoring system using IoT  
- To collect vital health data continuously  
- To send data to the cloud using the internet  
- To display health data on a web dashboard and mobile app  
- To provide a low-cost solution for remote health monitoring

## System Features
- Real-time health data monitoring  
- Cloud data storage and visualization  
- Web dashboard for doctors/patients  
- Mobile application for doctors/patients
- Environmental condition monitoring  
- Remote access from anywhere

## Technologies Used
### Hardware
- ESP32 Dev Kit V1
- ESP32 30P Development Expansion Board
- MAX30102 (Heart Rate + SpO2) Sensor
- DS18B20 (Body Temperature) Sensor
- AD8232(ECG) Sensor
- DHT22 (Room Temperature + Humidity) Sensor
- Passive Buzzer Module
- Red & Green LED
- 4.7k Ω Resistor
- Battery (Li-ion 18650 x 2)
- Type-C 2S 2A Charging Module
- DC Male Jack
- Breadboard
- Jumper Wires (male-to-male / male-to-female)

### Software
- ESP32 Firmware (Arduino C/C++)
- Web Dashboard (React.js)
- Mobile Application (React Native, Expo Framework )
- Firebase Real-time Database

## Project Folder Structure
iot-based-health-monitoring-system/
│
├── circuit-design/ # Circuit diagrams and hardware design
├── esp32-firmware/ # ESP32 microcontroller code
├── mobile-app/ # Mobile application source code
└── web-dashboard/ # Web dashboard source code

## How the System Works
1. Sensors collect real-time health and environmental data.
2. The ESP32 reads the sensor data.
3. Data is sent to the cloud using Wi-Fi.
4. The web dashboard and mobile app fetch the data from the cloud.
5. Users can monitor the data in real time from anywhere.

## Applications
- Remote patient monitoring  
- Personal health tracking  
- Early disease detection  
- Telemedicine support  
- Fitness and wellness monitoring

## Future Improvements
- AI-based health analysis
- Adding more sensor like blood pressure, motion sensors for detailed health tracking
- Add login options so multiple users can monitor their data from the same system
- Wearable device integration

## Contributors
- Jakir Hossain
- KM Zunayed
- Department of CSE, Prime University, Dhaka, Bangladesh

## License
This project is developed for academic purposes. You are free to use and modify it for learning and research.

## Acknowledgement
We would like to express our sincere thanks to our project supervisor Md. Samrat Ali Abu Kawser and department for their guidance and support throughout this project.
