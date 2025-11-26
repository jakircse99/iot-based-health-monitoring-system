import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { db, onValue, ref } from "./firebaseConfig";
import calculateHealthScore from "./utils/calculateHealthScore";

//. icons
import { FaHeartbeat, FaLungs, FaTemperatureHigh } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { WiHumidity } from "react-icons/wi";
import AlertMessage from "./components/AlertMessage";
import ECGChart from "./components/ECGChart";

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
          const next = [...prev, { value: val.ecgRaw || 0 }];
          if (next.length > 100) next.shift();
          return next;
        });

        // set health score
        setHealthScore(calculateHealthScore(val));
      }
    });
  }, []);

  // Online status check
  useEffect(() => {
    const checkStatus = () => {
      const onlineStatus = Date.now() - data.lastActive < 5000;
      setIsOnline(onlineStatus);
    };
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
      icon: <FaHeartbeat size={28} className="text-[#ef4444]" />,
    },
    {
      label: "SpO₂",
      value: data.spo2 != -999 ? data.spo2 : 0,
      max: 100,
      unit: "%",
      color: "#3b82f6",
      icon: <FaLungs size={28} className="text-blue-500 " />,
    },
    {
      label: "Body Temp",
      value: ((data.bodyTemp * 9) / 5 + 32).toPrecision(4),
      max: 115.7,
      unit: "°F",
      color: "#f97316",
      icon: <FaTemperatureHigh size={28} className="text-orange-400" />,
    },
    {
      label: "Room Temp",
      value: data.roomTemp,
      max: 45,
      unit: "°C",
      color: "#22c55e",
      icon: <FaHouse size={28} className="text-green-400" />,
    },
    {
      label: "Humidity",
      value: data.humidity,
      max: 100,
      unit: "%",
      color: "#06b6d4",
      icon: <WiHumidity size={32} className="text-cyan-400" />,
    },
  ];

  return (
    <div className="font-sans min-h-screen lg:flex lg:flex-col lg:h-screen bg-[#0D1117] text-[#E0E0E0] p-6 gap-3">
      {/************** Header **************/}

      <h1 className="text-3xl font-bold mb-2 text-center font-stretch-ultra-expanded">
        <img
          className="inline mr-3"
          src="../public/logo.png"
          alt="logo"
          width={50}
          height={50}
        />
        IoT Health Monitoring System
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-center mb-4 gap-4">
        {/* Online status */}
        <span
          className={`px-4 py-1 rounded-full text-sm font-semibold ${
            isOnline ? "bg-[#27ae60]" : "bg-[#dc143c]"
          }`}
        >
          {isOnline ? "Device Online" : "Device Offline"}
        </span>

        {/* Health Score */}
        <div className="flex items-center gap-3 ">
          <div className="w-50 lg:w-80 rounded-full bg-gray-700 overflow-hidden">
            <div
              className="px-4 py-1 text-sm font-semibold"
              style={{
                width: `${healthScore.score}%`,
                backgroundColor: healthScore.color,
                transition: "width 0.3s ease",
              }}
            >
              <p className="whitespace-nowrap">Health Score</p>
            </div>
          </div>
          <span className="text-sm font-semibold">{healthScore.score}/100</span>
        </div>
        {/* Alert message */}
        <AlertMessage alertMessages={alertMessages} />
      </div>

      {/************** Gauges **************/}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-4">
        {gauges.map((g, i) => (
          <div
            key={i}
            className="bg-[#161B22] rounded-2xl p-4 shadow-lg flex flex-col items-center"
          >
            <div className="w-25 h-25 lg:w-25 lg:h-25 mb-3">
              <CircularProgressbar
                value={g.value}
                maxValue={g.max}
                text={`${g.value} ${g.unit}`}
                styles={buildStyles({
                  textColor: "#E0E0E0",
                  textSize: "16px",
                  pathColor: g.color,
                  trailColor: "#2C2F36",
                })}
              />
            </div>
            <div className="flex items-center justify-center gap-2 text-lg font-medium text-gray-200">
              <div>{g.icon}</div>
              <h2>{g.label}</h2>
            </div>
          </div>
        ))}
      </div>

      {/************** ECG Chart **************/}
      <ECGChart ecgData={ecgData} />

      {/************** Footer **************/}
      <footer className=" text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} IoT Health Monitoring System.
        <p>
          <strong>Developed by</strong> Jakir Hossain (52E Batch), KM Zunayed
          (55E Batch). <strong>Supervised by</strong> Md. Samrat Ali Abu Kawser
          (Senior Lecturer)
        </p>
        <p>Department of CSE</p>
        <p>Prime University</p>
      </footer>
    </div>
  );
}
