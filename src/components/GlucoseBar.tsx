import { DimensionValue, StyleSheet, View } from "react-native";

interface GlucoseBarProps {
  glucoseReading: number;
  thresholdType: { lowValue: number; highValue: number };
  barColour: string;
}

export default function GlucoseBar({
  glucoseReading,
  thresholdType,
  barColour,
}: GlucoseBarProps) {
  const min = thresholdType.lowValue;
  const max = thresholdType.highValue;

  // Clamping method that ensures filled bar doesn't overextend if glucose value is lower/higher than thresholds
  const percentage = Math.max(
    0,
    Math.min(1, (glucoseReading - min) / (max - min)),
  );

  // Multiplies the value of percentage (can only return a value between 0-1) by 100 and returns a string (e.g 0.5 -> "50%")
  const percentageWidth: DimensionValue = `${percentage * 100}%`;

  return (
    <View style={styles.barBackground}>
      <View
        style={[
          styles.filledBar,
          {
            width: percentageWidth,
            backgroundColor: barColour,
          },
        ]}
      ></View>
    </View>
  );
}

const styles = StyleSheet.create({
  barBackground: {
    flex: 1,
    backgroundColor: "#282C36",
    borderRadius: 50,
    height: 10,
    marginHorizontal: 10,
  },
  filledBar: {
    borderRadius: 50,
    height: 10,
  },
});
