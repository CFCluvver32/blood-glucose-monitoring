import { useReadings } from "@/context/ReadingsContext";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import MedicationsList from "../MedicationsList";

export default function MedicationHistoryTab() {
  const { medications } = useReadings();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {medications.length === 0 ? (
        <>
          <View style={styles.noMedicationsContainer}>
            <Text style={styles.noMedicationsText}>No medications logged.</Text>
          </View>
        </>
      ) : (
        <MedicationsList medications={medications} />
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
  noMedicationsContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  noMedicationsText: {
    color: "#ffffff",
    fontSize: 18,
  },
});
