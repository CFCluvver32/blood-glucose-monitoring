import ReadingCard from "@/components/ReadingCard";
import { useReadings } from "@/context/ReadingsContext";
import { useSettings } from "@/context/SettingsContext";
import { greeting } from "@/utils/date";
import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { readings } = useReadings();
  const { user, thresholds } = useSettings();
  const [greetingMessage, setGreetingMessage] = useState(greeting());

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingMessage(greeting());
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const latestReading = readings[0];

  const aThreshold = latestReading
    ? thresholds.find(
        (threshold) => threshold.thresholdType === latestReading.type,
      )
    : undefined;

  const readingThreshold = {
    lowValue: aThreshold?.lowValue ?? 0,
    highValue: aThreshold?.highValue ?? 0,
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.greeting}>{greetingMessage}</Text>
        {user?.firstName && (
          <Text style={styles.greeting}>{user?.firstName}</Text>
        )}
        <ReadingCard reading={readings[0]} threshold={readingThreshold} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0c0f",
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  greeting: {
    marginTop: 14,
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
});
