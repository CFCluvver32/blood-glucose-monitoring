import ReadingsList from "@/components/ReadingsList";
import { useReadings } from "@/context/ReadingsContext";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function GlucoseHistoryTab() {
  const { readings, loading, error } = useReadings();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {readings.length === 0 ? (
        <>
          <View style={styles.noReadingsContainer}>
            <Text style={styles.noReadingsText}>No readings logged.</Text>
          </View>
        </>
      ) : (
        <>
          {/* 
          <View style={styles.chartContainer}>
            <Pressable onPress={() => router.push("/chart_detail")}>
              <ReadingsPreviewChart />
            </Pressable>
          </View>
          */}
          <ReadingsList readings={readings} />
        </>
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
  chartContainer: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#42454D",
    padding: 10,
  },
  noReadingsContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  noReadingsText: {
    color: "#ffffff",
    fontSize: 18,
  },
});
