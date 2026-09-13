import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ExerciseSelectorProps {
  value: string | "";
  onChange: (selection: string) => void;
}

const activityIcons: Record<string, string> = {
  Walk: "walk",
  Run: "run",
  Cycling: "bike",
  Swimming: "swim",
  HIIT: "heart",
  Weightlifting: "weight-lifter",
  Yoga: "yoga",
  Pilates: "meditation",
  Other: "dots-horizontal",
};

export default function ExerciseSelector({
  value,
  onChange,
}: ExerciseSelectorProps) {
  const activityTypes = [
    "Walk",
    "Run",
    "Cycling",
    "Swimming",
    "HIIT",
    "Weightlifting",
    "Yoga",
    "Pilates",
    "Other",
  ];

  return (
    <View style={styles.activityContainer}>
      {activityTypes.map((activity) => {
        const isSelected = value === activity;
        return (
          <Pressable
            key={activity}
            style={[
              styles.activityOption,
              activity === "Other"
                ? styles.activityOptionFullWidth
                : styles.activityOptionHalfWidth,
              {
                borderWidth: 2,
                borderColor: isSelected ? "#3eec6f" : "transparent",
                backgroundColor: isSelected ? "#25aa3240" : "#282C36",
              },
              isSelected && styles.activityOptionShadow,
            ]}
            onPress={() => onChange(activity)}
          >
            <MaterialCommunityIcons
              name={activityIcons[activity]}
              size={18}
              color={isSelected ? "#00d63d" : "#808080"}
            />
            <Text
              style={[
                styles.activityText,
                {
                  color: isSelected ? "#3eec6f" : "#808080",
                  fontWeight: isSelected ? 700 : 500,
                },
              ]}
            >
              {activity}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  activityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  activityOption: {
    borderRadius: 10,
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
  activityOptionHalfWidth: {
    width: "48%",
    height: 50,
  },
  activityOptionFullWidth: {
    width: "100%",
    height: 50,
  },
  activityOptionShadow: {
    shadowColor: "#3eec6f",
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  contextIcon: {
    width: 18,
  },
  activityText: {
    fontSize: 18,
    fontWeight: "500",
  },
});
