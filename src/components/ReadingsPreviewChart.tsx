import { useReadings } from "@/context/ReadingsContext";
import { toDate } from "@/utils/date";
import { useFont } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { View } from "react-native";
import { CartesianChart, Line, Scatter } from "victory-native";

export default function ReadingsPreviewChart() {
  const { readings } = useReadings();

  const interRegular = require("@/assets/fonts/Inter_18pt-Regular.ttf");
  const numbersFont = useFont(interRegular, 10);
  const titleFont = useFont(interRegular, 14);

  const { chartData, xAxisDomain } = useMemo(() => {
    const dateNow = Date.now();

    // Sorts the readings in ascending order
    const sortReadings = (listOfReadings: typeof readings) =>
      listOfReadings
        .map((reading) => ({
          x: toDate(reading.recordedAt).getTime(),
          y: reading.glucoseReading,
        }))
        .sort((a, b) => a.x - b.x);

    const points = sortReadings(readings);
    const start = points.length ? points[0].x : dateNow;
    return {
      chartData: points,
      xAxisDomain: [start, dateNow] as [number, number],
    };
  }, [readings]);

  return (
    <View style={{ height: 200 }}>
      <CartesianChart
        data={chartData}
        xKey="x"
        yKeys={["y"]}
        domain={{ x: xAxisDomain }}
        padding={{ left: 6, right: 14, top: 8, bottom: 6 }}
        domainPadding={{ left: 16, right: 16, top: 20 }}
        xAxis={{
          font: numbersFont,
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
          title: { text: "Date", color: "#808080", font: titleFont },
        }}
        yAxis={[
          {
            font: numbersFont,
            labelColor: "#808080",
            lineColor: "#282C36",
            title: {
              text: "Glucose (mmol/L)",
              color: "#808080",
              font: titleFont,
            },
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
  );
}
