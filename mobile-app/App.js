import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import AlertMessage from "./components/AlertMessage";
import ECGChart from "./components/ECGChart";
import { db, onValue, ref } from "./firebaseConfig";
import calculateHealthScore from "./utils/calculateHealthScore";
export default function App() {
  const [data, setData] = useState({
    heartRate: 0,
    spo2: 0,
    bodyTemp: 0,
    roomTemp: 0,
    humidity: 0,
    ecgRaw: 0,
    leadsOff: true,
    lastActive: 0,
    alertMessage: "",
  });
  const [ecgData, setEcgData] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [healthScore, setHealthScore] = useState({
    score: 0,
    color: "#e67e22",
  });

  const alertMessages = data.alertMessage
    ? data.alertMessage
        .split(";")
        .map((msg) => msg.trim())
        .filter(Boolean)
    : [];

  // fecth data from firebase
  useEffect(() => {
    const deviceRef = ref(db, "devices/device_001");
    onValue(deviceRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        setData(val);

        setEcgData((prev) => {
          const next = [...prev, { x: Date.now(), y: val.ecgRaw || 0 }];
          if (next.length > 50) next.shift();
          return next;
        });

        // set health score
        setHealthScore(calculateHealthScore(val));
      }
    });
  }, []);

  // Online status check
  useEffect(() => {
    const checkStatus = () => setIsOnline(Date.now() - data.lastActive < 5000);
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [data.lastActive]);

  // configure guages in array
  const gauges = [
    {
      label: "Heart Rate",
      value: data.heartRate,
      max: 150,
      unit: "BPM",
      color: "#ef4444",
      icon: "heartbeat",
    },
    {
      label: "SpO₂",
      value: data.spo2 != -999 ? data.spo2 : 0,
      max: 100,
      unit: "%",
      color: "#3b82f6",
      icon: "lungs",
    },
    {
      label: "Body Temp",
      value: ((data.bodyTemp * 9) / 5 + 32).toPrecision(4),
      max: 115.7,
      unit: "°F",
      color: "#f97316",
      icon: "temperature-high",
    },
    {
      label: "Room Temp",
      value: data.roomTemp,
      max: 45,
      unit: "°C",
      color: "#22c55e",
      icon: "home",
    },
    {
      label: "Humidity",
      value: data.humidity,
      max: 100,
      unit: "%",
      color: "#06b6d4",
      icon: "tint",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>IoT Health Monitoring System</Text>
      {/*-------- device & alert message container --------*/}
      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.status,
            { backgroundColor: isOnline ? "#27ae60" : "#dc143c" },
          ]}
        >
          {isOnline ? "Device Online" : "Device Offline"}
        </Text>
        <AlertMessage alertMessages={alertMessages} />
      </View>

      {/*-------- health score bar container --------*/}
      <View style={styles.healthScoreBar}>
        <View
          style={[
            styles.healthScoreFill,
            {
              width: `${healthScore.score}%`,
              backgroundColor: healthScore.color,
            },
          ]}
        />
        <Text style={styles.healthScoreTitle}>Health score</Text>
        <Text style={styles.healthScoreText}>{healthScore.score}/100</Text>
      </View>

      {/*-------- gauges container --------*/}
      <View style={styles.gaugeContainer}>
        {gauges.map((g, i) => (
          <View key={i} style={styles.gaugeBox}>
            <AnimatedCircularProgress
              size={120}
              width={10}
              fill={(g.value / g.max) * 100}
              tintColor={g.color}
              backgroundColor="#2C2F36"
            >
              {() => (
                <Text style={styles.gaugeValue}>
                  {g.value} {g.unit}
                </Text>
              )}
            </AnimatedCircularProgress>
            <View style={styles.gaugeLabel}>
              <FontAwesome5 name={g.icon} size={20} color={g.color} />
              <Text style={styles.gaugeText}>{g.label}</Text>
            </View>
          </View>
        ))}
      </View>

      {/*-------- ecg chart --------*/}
      <Text style={styles.chartTitle}>ECG Realtime Waveform</Text>
      <ECGChart ecgData={ecgData} />

      {/*-------- footer --------*/}
      <Text style={styles.footer}>
        © {new Date().getFullYear()} IoT Health Monitoring System.{"\n"}
        Developed by Jakir Hossain & KM Zunayed{"\n"}
        Supervised by Md. Samrat Ali Abu Kawser {"\n"}
        Department of CSE {"\n"}
        Prime University
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    color: "#E0E0E0",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  status: { color: "white", padding: 5, borderRadius: 5, fontWeight: "600" },
  healthScoreBar: {
    height: 25,
    backgroundColor: "#333",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 10,
  },
  healthScoreFill: { height: "100%" },
  healthScoreTitle: {
    position: "absolute",
    left: 10,
    color: "white",
    fontWeight: "bold",
  },
  healthScoreText: {
    position: "absolute",
    right: 10,
    color: "white",
    fontWeight: "bold",
  },
  gaugeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  gaugeBox: {
    alignItems: "center",
    margin: 10,
    backgroundColor: "#161B22",
    borderRadius: 5,
    padding: 10,
    boxShadow:
      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
  gaugeValue: { color: "#E0E0E0", fontSize: 14, marginTop: 5 },
  gaugeLabel: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  gaugeText: { color: "#E0E0E0", marginLeft: 5 },
  chartTitle: { color: "#E0E0E0", fontWeight: "bold", marginBottom: 10 },
  footer: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 80,
  },
});
