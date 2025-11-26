import { useEffect, useState } from "react";

export default function AlertMessage({ alertMessages }) {
  const [current, setCurrent] = useState(0);

  // Rotate alerts every 1 second
  useEffect(() => {
    if (alertMessages.length > 1) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % alertMessages.length);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCurrent(0);
    }
  }, [alertMessages]);

  const isAlert = alertMessages.length > 0;

  return (
    <div
      className={`transition-transform w-60 text-center px-4 py-1 rounded-full text-sm font-semibold ${
        isAlert ? "bg-[#dc143c] text-white" : "bg-[#27ae60] text-white"
      }`}
    >
      <span>{isAlert ? alertMessages[current] : "No health issues"}</span>
    </div>
  );
}
