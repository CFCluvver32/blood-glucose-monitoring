import { useReadings } from "@/context/ReadingsContext";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ExercisesList from "../ExercisesList";

export default function ExerciseHistoryTab() {
  const { exercises } = useReadings();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {exercises.length === 0 ? (
        <>
          <View style={styles.noExercisesContainer}>
            <Text style={styles.noExercisesText}>No exercises logged.</Text>
          </View>
        </>
      ) : (
        <ExercisesList exercises={exercises} />
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
  noExercisesContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  noExercisesText: {
    color: "#ffffff",
    fontSize: 18,
  },
});
