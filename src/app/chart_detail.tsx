import { useReadings } from "@/context/ReadingsContext";
import { toDate } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { useFont } from "@shopify/react-native-skia";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CartesianChart, Line, Scatter } from "victory-native";

// Defines the time ranges that can be selected by the user.
type TimeRange = "7d" | "30d" | "90d" | "All";

// Specifies the available time range options for UI. Used to map each time range to a Pressable button.
const timeRanges: TimeRange[] = ["7d", "30d", "90d", "All"];

// A dictionary that maps each time range to an equivalent number of days.
// "All" is excluded because it does not have a fixed number of days.
const timeRangeToDayCount: Record<Exclude<TimeRange, "All">, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export default function ChartDetail() {
  const { readings } = useReadings();
  const [timeRange, setTimeRange] = useState<TimeRange>("All");

  // Specifies the font that is used for the numbers and labels within the chart.
  const font = useFont(require("@/assets/fonts/Inter_18pt-Regular.ttf"), 12);

  //
  const { chartData, xAxisDomain } = useMemo(() => {
    const dateNow = Date.now();

    // Converts the readings into x and y co-ordinates to be plotted on the chart.
    // Readings are sorted in ascending order from the oldest to the newest.
    const sortReadings = (listOfReadings: typeof readings) =>
      listOfReadings
        .map((reading) => ({
          x: toDate(reading.recordedAt).getTime(),
          y: reading.glucoseReading,
        }))
        .sort((a, b) => a.x - b.x);

    // const readingsSpan =
    // const windowSpan = xAxisDomain[1] - xAxisDomain[0];
    // const isSparse = windowSpan > 0 && readingsSpan / windowSpan < 0.1;

    // Returns all of the readings from the oldest to now.
    if (timeRange === "All") {
      const points = sortReadings(readings);
      const start = points.length ? points[0].x : dateNow;
      return {
        chartData: points,
        xAxisDomain: [start, dateNow] as [number, number],
      };
    }

    //
    const dayCount = timeRangeToDayCount[timeRange];
    const millisecondsPerDay = 60 * 60 * 24 * 1000;
    const start = dateNow - dayCount * millisecondsPerDay;
    const points = sortReadings(
      readings.filter(
        (reading) => toDate(reading.recordedAt).getTime() > start,
      ),
    );
    return {
      chartData: points,
      xAxisDomain: [start, dateNow] as [number, number],
    };
  }, [readings, timeRange]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.title}>Chart details</Text>
          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="white" />
          </Pressable>
        </View>
        <View style={styles.timeRangeButtons}>
          {timeRanges.map((aTimeRange) => (
            <Pressable
              key={aTimeRange}
              style={[
                styles.button,
                timeRange === aTimeRange && styles.buttonSelected,
              ]}
              onPress={() => setTimeRange(aTimeRange)}
            >
              <Text
                style={[
                  styles.buttonText,
                  timeRange === aTimeRange && styles.buttonTextSelected,
                ]}
              >
                {aTimeRange}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.chartWrapper}>
          <View style={styles.chart}>
            <CartesianChart
              data={chartData}
              xKey="x"
              yKeys={["y"]}
              domain={{ x: xAxisDomain }}
              xAxis={{
                font,
                labelColor: "#808080",
                lineColor: "#282C36",
                formatXLabel: (ms) => {
                  const date = new Date(ms);
                  const dateSection = date.toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                  });

                  const timeSection = date.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return `${dateSection}\n${timeSection}`;
                },
                title: { text: "Date", color: "#808080" },
              }}
              yAxis={[
                {
                  font,
                  labelColor: "#808080",
                  lineColor: "#282C36",
                  title: { text: "Glucose (mmol/L)", color: "#808080" },
                },
              ]}
            >
              {({ points }) => (
                <>
                  <Line points={points.y} strokeWidth={2} color="#0dff00" />
                  <Scatter points={points.y} radius={4} color="#0dff00" />
                </>
              )}
            </CartesianChart>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
    backgroundColor: "#17191f",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff",
  },
  timeRangeButtons: {
    flexDirection: "row",
    marginTop: 20,
    backgroundColor: "#0a0c0f",
    borderRadius: 14,
    padding: 4,
    height: 64,
  },
  chartWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  chart: {
    height: 600,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSelected: {
    backgroundColor: "#282C36",
    borderWidth: 2,
    borderColor: "#3eec6f",
  },
  buttonText: {
    color: "#808080",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextSelected: {
    color: "#3eec6f",
    fontWeight: "700",
  },
});
