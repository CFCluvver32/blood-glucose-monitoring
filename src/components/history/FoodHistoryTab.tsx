import { useReadings } from "@/context/ReadingsContext";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import MealsList from "../MealsList";

export default function FoodHistoryTab() {
  const { meals } = useReadings();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {meals.length === 0 ? (
        <>
          <View style={styles.noMealsContainer}>
            <Text style={styles.noMealsText}>No meals logged.</Text>
          </View>
        </>
      ) : (
        <MealsList meals={meals} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  noMealsContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  noMealsText: {
    color: "#ffffff",
    fontSize: 18,
  },
});
