import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface IntensitySelectorProps {
  value: string | "";
  onChange: (selection: string) => void;
}

const intensityBackgroundColours: Record<string, string> = {
  Low: "#1d881d7d",
  Moderate: "#cb792189",
  High: "#c43a3541",
};

const intensityBorderColours: Record<string, string> = {
  Low: "#3aff5b",
  Moderate: "#ff9811",
  High: "#e20707",
};

export default function IntensitySelector({
  value,
  onChange,
}: IntensitySelectorProps) {
  const intensityTypes = ["Low", "Moderate", "High"];

  return (
    <View style={styles.intensityContainer}>
      {intensityTypes.map((intensity) => {
        const isSelected = value === intensity;
        return (
          <Pressable
            key={intensity}
            style={[
              styles.contextOption,
              {
                borderWidth: 2,
                borderColor: isSelected
                  ? intensityBorderColours[intensity]
                  : "transparent",
                backgroundColor: isSelected
                  ? intensityBackgroundColours[intensity]
                  : "#282C36",
              },
            ]}
            onPress={() => onChange(intensity)}
          >
            <MaterialCommunityIcons
              name="fire"
              size={24}
              color={isSelected ? intensityBorderColours[intensity] : "#808080"}
            />
            <Text
              style={[
                styles.contextText,
                {
                  color: isSelected
                    ? intensityBorderColours[intensity]
                    : "#808080",
                  fontWeight: isSelected ? 700 : 500,
                },
              ]}
            >
              {intensity}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  intensityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  contextOption: {
    width: "32%",
    aspectRatio: 2.5,
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
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
