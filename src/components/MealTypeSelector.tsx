import { MealType } from "@/db/database";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface MealTypeSelectorProps {
  value: MealType | "";
  onChange: (meal: MealType) => void;
}

const mealIcons: Record<MealType, string> = {
  Breakfast: "food-croissant",
  Lunch: "food-fork-drink",
  Dinner: "silverware-fork-knife",
  Snack: "food-apple",
};

export default function MealTypeSelector({
  value,
  onChange,
}: MealTypeSelectorProps) {
  const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

  return (
    <View style={styles.mealContainer}>
      {mealTypes.map((meal) => {
        const isSelected = value === meal;
        return (
          <Pressable
            key={meal}
            style={[
              styles.mealOption,
              {
                borderWidth: 2,
                borderColor: isSelected ? "#3eec6f" : "transparent",
                backgroundColor: isSelected ? "#25aa3240" : "#282C36",
              },
              isSelected && styles.mealOptionShadow,
            ]}
            onPress={() => onChange(meal)}
          >
            <MaterialCommunityIcons
              name={mealIcons[meal]}
              size={18}
              color={isSelected ? "#3eec6f" : "#808080"}
            />
            <Text
              style={[
                styles.mealText,
                {
                  color: isSelected ? "#3eec6f" : "#808080",
                  fontWeight: isSelected ? 700 : 500,
                },
              ]}
            >
              {meal}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  mealContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  mealOption: {
    width: "48%",
    aspectRatio: 2.5,
    borderRadius: 10,
    padding: 20,
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
  mealOptionShadow: {
    shadowColor: "#3eec6f",
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  mealText: {
    fontSize: 18,
    fontWeight: "500",
  },
});
