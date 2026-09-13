import { ThresholdType } from "@/db/database";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ContextSelectorProps {
  value: ThresholdType | "";
  onChange: (selection: ThresholdType) => void;
}

const contextBackgroundColours: Record<string, string> = {
  "Pre-meal": "#1d6264c9",
  "Post-meal": "#985711ba",
  Exercise: "#d900ff2a",
  Fasting: "#2f7c18a5",
};

const contextBorderColours: Record<string, string> = {
  "Pre-meal": "#00f7ff",
  "Post-meal": "#ff9811",
  Exercise: "#d900ff",
  Fasting: "#4eff5a",
};

const contextIcons: Record<string, string> = {
  "Pre-meal": "glass-water",
  "Post-meal": "utensils",
  Exercise: "person-running",
  Fasting: "moon",
};

export default function ContextSelector({
  value,
  onChange,
}: ContextSelectorProps) {
  const contextTypes: ThresholdType[] = [
    "Pre-meal",
    "Post-meal",
    "Exercise",
    "Fasting",
  ];

  return (
    <View style={styles.contextContainer}>
      {contextTypes.map((context) => {
        const isSelected = value === context;
        return (
          <Pressable
            key={context}
            style={[
              styles.contextOption,
              {
                borderWidth: 2,
                borderColor: isSelected
                  ? contextBorderColours[context]
                  : "transparent",
                backgroundColor: isSelected
                  ? contextBackgroundColours[context]
                  : "#282C36",
              },
            ]}
            onPress={() => onChange(context)}
          >
            <FontAwesome6
              name={contextIcons[context]}
              size={18}
              color={isSelected ? contextBorderColours[context] : "#808080"}
              style={styles.contextIcon}
            />
            <Text
              style={[
                styles.contextText,
                {
                  color: isSelected ? contextBorderColours[context] : "#808080",
                  fontWeight: isSelected ? 700 : 500,
                },
              ]}
            >
              {context}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  contextContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  contextOption: {
    width: "48%",
    aspectRatio: 2.5,
    borderRadius: 50,
    padding: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  contextIcon: {
    width: 18,
  },
  contextText: {
    fontSize: 18,
    fontWeight: "500",
  },
});
