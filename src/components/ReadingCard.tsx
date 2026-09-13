import { Reading } from "@/db/database";
import { formatReadingDateTime } from "@/utils/date";
import { StyleSheet, Text, View } from "react-native";

interface ReadingCardProps {
  reading: Reading | null;
  threshold: { lowValue: number; highValue: number };
}

export default function ReadingCard({ reading, threshold }: ReadingCardProps) {
  const isWithinThreshold =
    reading &&
    reading.glucoseReading >= threshold.lowValue &&
    reading.glucoseReading <= threshold.highValue;

  return (
    <View
      style={[
        styles.readingWrapper,
        {
          backgroundColor: isWithinThreshold ? "#172319" : "#473216",
          borderColor: isWithinThreshold ? "#0fe500" : "#ff8400",
        },
      ]}
    >
      <Text
        style={[
          styles.latestReadingText,
          { color: isWithinThreshold ? "#0fe500" : "#ff8400" },
        ]}
      >
        LATEST READING:
      </Text>
      {reading ? (
        <>
          <View style={styles.readingRow}>
            <Text
              style={[
                styles.glucoseReading,
                { color: isWithinThreshold ? "#0fe500" : "#ff8400" },
              ]}
            >
              {reading.glucoseReading}
            </Text>
            <Text
              style={[
                styles.unit,
                { color: isWithinThreshold ? "#0fe500" : "#ff8400" },
              ]}
            >
              {" "}
              mmol/L
            </Text>
          </View>
          <Text style={styles.dateTime}>
            {formatReadingDateTime(reading.recordedAt)}
          </Text>
        </>
      ) : (
        <Text style={styles.noReadingsText}>No readings yet</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  readingWrapper: {
    paddingVertical: 20,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#42454D",
    backgroundColor: "#282C36",
    marginHorizontal: 20,
  },
  latestReadingText: {
    paddingHorizontal: 20,
    fontSize: 20,
    letterSpacing: 1,
    fontWeight: "700",
    color: "#ADADAD",
  },
  readingRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  glucoseReading: {
    fontSize: 64,
    fontWeight: "800",
  },
  unit: {
    fontSize: 24,
    fontWeight: "400",
  },
  dateTime: {
    textAlign: "center",
    fontSize: 18,
    color: "#0fe500",
    paddingBottom: 10,
  },
  noReadingsText: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    fontSize: 18,
    color: "#ADADAD",
  },
});
