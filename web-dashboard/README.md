# Web Dashboard (React + Vite + Firebase)
This folder contains the **web dashboard** of our IoT based Health Monitoring System. The dashboard is built using **React JS with Vite** for fast development and uses **Firebase Realtime Database** to display live sensor data sent from the ESP32.

## Technologies Used
- Node JS
- React JS
- Vite
- Tailwind CSS
- Firebase Realtime Database
- JavaScript
- HTML & CSS

## Features
- View real-time sensor data from the ESP32.
- Device online/offline status.
- Alert messages.
- Overall health score based on safe range analysis.
- Charts showing heart rate, SpO₂, body temperature, room temperature and humidity.
- Graphs showing real-time ECG waveform for heart monitoring.
- Environmental readings like room temperature and humidity.
- Instant updates as new data arrives from the Firebase.
- Simple and responsive user interface

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
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_DATABASE_URL=your_database_url
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open the shown local URL in your browser.

## Data Flow
- ESP32 → Firebase Realtime Database
- Firebase → React Web Dashboard (Live Data Display)
