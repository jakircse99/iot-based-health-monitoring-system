import { View } from "react-native";
import { CartesianChart, Line } from "victory-native";

export default function ECGChart({ ecgData }) {
  return (
    <View
      style={{
        height: 200,
        backgroundColor: "#161B22",
        borderRadius: 16,
        padding: 10,
      }}
    >
      <CartesianChart data={ecgData} xKey="x" yKeys={["y"]}>
        {({ points }) => (
          <Line
            points={points.y}
            color="#10b981"
            strokeWidth={2}
            curveType="linear"
            animate={{ type: "timing", duration: 100 }}
            connectMissingData={true}
          />
        )}
      </CartesianChart>
    </View>
  );
}
