import { useSettings } from "@/context/SettingsContext";
import { DEFAULT_THRESHOLDS } from "@/db/database";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface GlucoseThresholdProps {
  title: string;
  primaryColour: string;
  secondaryColour: string;
}

export default function GlucoseThreshold({
  title,
  primaryColour,
  secondaryColour,
}: GlucoseThresholdProps) {
  const { thresholds, updateThreshold } = useSettings();
  const aThreshold = thresholds.find(
    (threshold) => threshold.thresholdType === title,
  );

  const [lowValueText, setLowValueText] = useState(
    String(aThreshold?.lowValue),
  );
  const [highValueText, setHighValueText] = useState(
    String(aThreshold?.highValue),
  );

  const handleBlur = () => {
    if (!aThreshold) return;
    const lowValue = Number(lowValueText);
    const highValue = Number(highValueText);
    updateThreshold(aThreshold.thresholdType, lowValue, highValue);
  };

  const defaultThreshold = DEFAULT_THRESHOLDS.find(
    (threshold) => threshold.thresholdType === title,
  );

  const resetLowValue = () => {
    if (!defaultThreshold || !aThreshold) return;
    const lowValue = defaultThreshold.lowValue;
    setLowValueText(String(lowValue));
    updateThreshold(aThreshold.thresholdType, lowValue, Number(highValueText));
  };

  const resetHighValue = () => {
    if (!defaultThreshold || !aThreshold) return;
    const highValue = defaultThreshold.highValue;
    setHighValueText(String(highValue));
    updateThreshold(aThreshold.thresholdType, Number(lowValueText), highValue);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: primaryColour, borderColor: secondaryColour },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: secondaryColour }]}>{title}</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Low</Text>
            <Pressable style={styles.resetButton} onPress={resetLowValue}>
              <MaterialCommunityIcons name="restore" size={20} color="white" />
            </Pressable>
          </View>
          <TextInput
            style={styles.input}
            value={lowValueText}
            keyboardType="decimal-pad"
            onChangeText={setLowValueText}
            onBlur={handleBlur}
          />
        </View>
        <Text style={styles.dash}>-</Text>
        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>High</Text>
            <Pressable style={styles.resetButton} onPress={resetHighValue}>
              <MaterialCommunityIcons name="restore" size={20} color="white" />
            </Pressable>
          </View>
          <TextInput
            style={styles.input}
            value={highValueText}
            keyboardType="decimal-pad"
            onChangeText={setHighValueText}
            onBlur={handleBlur}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    paddingHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  field: {
    flex: 1,
  },
  labelRow: {
    flexDirection: "row",
  },
  label: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "bold",
  },
  resetButton: {
    marginLeft: 8,
  },
  input: {
    backgroundColor: "#0a0c0f",
    borderRadius: 10,
    paddingVertical: 14,
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  dash: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 12,
    marginTop: 20,
  },
});
