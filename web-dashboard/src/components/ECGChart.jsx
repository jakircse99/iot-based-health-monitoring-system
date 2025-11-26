import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
export default function ECGChart({ ecgData }) {
  return (
    <div className="flex-1 bg-[#161B22] rounded-2xl p-4 shadow-lg overflow-hidden">
      <h2 className="text-lg font-semibold mb-2">ECG Realtime Waveform</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={ecgData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            dot={false}
            strokeWidth={2}
          />
          <XAxis hide />
          <YAxis hide domain={[0, 4095]} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
