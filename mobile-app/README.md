# Mobile App (React Native + Expo)
This folder contains the **mobile application** for the IoT-Based Health Monitoring System. The app is built with **React Native using the Expo framework** and reads live health data from **Firebase Realtime Database** to show real-time sensor values and alert messages.

## Technologies Used
- Node JS
- React Native
- Expo Framework
- JavaScript
- Firebase Realtime Database

## Features
- Real-time display of sensor data (heart rate, SpO₂, ECG, body temperature, room temperature & humidity)
- Device online/offline status.
- Alert messages.
- Overall health score based on safe range analysis.
- Charts showing heart rate, SpO₂, body temperature, room temperature and humidity.
- Graphs showing real-time ECG waveform for heart monitoring.
- Environmental readings like room temperature and humidity.
- Instant updates as new data arrives from the Firebase.
- Simple and responsive UI for phones

## How to Run the Project
1. Install **[Node.js](https://nodejs.org/en/download/current)** if don't have.
2. Open this folder in **[VS Code](https://code.visualstudio.com/)**.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file and add your Firebase credentials.
   Example:
    ```env
    EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    EXPO_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
    EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```
5. Start the Expo development server:
   ```bash
   npx expo start
   ```
6. Set up a local development environment for running your project on Android and iOS. Install Expo Go from Play Store/App Store and scan the QR code from terminal.
7. To build a development version of your app, you will need to install EAS CLI. **[Sign up](https://expo.dev/signup)** for an Expo account and run the following command.
   ```bash
   eas login
   ```
8. Configure your project
   ```bash
   eas build:configure
   ```
9. Create a build
   ```bash
   eas build --platform android --profile development
   ```
10. After the build is complete, scan the QR code in your terminal or open the link on your device. Tap Install to download the build on your device, then tap Open to install it.
    
## Data Flow
- ESP32 → Firebase Realtime Database
- Firebase → Mobile App (Live Data Display)

