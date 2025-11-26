export default function calculateHealthScore(data) {
  let score = 100;

  // Heart rate (normal: 60-100 BPM)
  if (data.heartRate < 40 || data.heartRate > 100) score -= 10;

  // SpO₂ (normal: 95-100%)
  if (data.spo2 < 95) score -= 20;

  // Body temperature (normal: 36.5-37.5°C)
  if (data.bodyTemp > 37.2) score -= 10;

  // Room temperature and humidity minor adjustment
  if (data.roomTemp < 18 || data.roomTemp > 35) score -= 10;
  if (data.humidity < 20 || data.humidity > 80) score -= 5;

  // Clamp score
  score = Math.max(Math.round(score), 0);

  // generate color based on health score
  let color = "#27ae60"; // Green
  if (score < 60) {
    color = "#dc143c"; // Red
  } else if (score < 80) {
    color = "#e67e22"; // Yellow
  }

  return { score, color };
}
