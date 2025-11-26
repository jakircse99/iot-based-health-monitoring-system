import { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";

export default function AlertMessage({ alertMessages }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (alertMessages.length === 0) return;

    const animate = () => {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Wait 1s, then fade out
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            // Move to next message
            setCurrentIndex((prev) => (prev + 1) % alertMessages.length);
          });
        }, 1000);
      });
    };

    animate();

    const interval = setInterval(() => {
      animate();
    }, 1600);

    return () => clearInterval(interval);
  }, [alertMessages, fadeAnim]);

  if (alertMessages.length === 0) {
    return (
      <View style={styles.successBadge}>
        <Text style={styles.text}>No health issues</Text>
      </View>
    );
  }

  return (
    <View style={styles.alertBadge}>
      <Animated.View style={[{ opacity: fadeAnim }]}>
        <Text style={styles.text}>{alertMessages[currentIndex]}</Text>
      </Animated.View>
    </View>
  );
}

const styles = {
  alertBadge: {
    backgroundColor: "#dc143c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    width: 205,
    alignItems: "center",
    justifyContent: "center",
  },
  successBadge: {
    backgroundColor: "#27ae60",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    width: 205,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { color: "#fff", fontWeight: "600", textAlign: "center" },
};
