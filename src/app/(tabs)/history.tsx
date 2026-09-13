import HistoryTabs from "@/components/history/HistoryTabs";
import { useReadings } from "@/context/ReadingsContext";
import { toDate } from "@/utils/date";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function History() {
  const { readings, loading, error } = useReadings();

  // Returns the date 30 days ago
  const dateThirtyDaysAgo = new Date();
  dateThirtyDaysAgo.setDate(dateThirtyDaysAgo.getDate() - 30);

  // Counts the number of readings recorded within the last 30 days
  const readingCount = readings.filter(
    (reading) => toDate(reading.recordedAt) > dateThirtyDaysAgo,
  ).length;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>History</Text>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <HistoryTabs />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#0a0c0f",
  },
  title: {
    marginTop: 14,
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    paddingHorizontal: 20,
  },
});
