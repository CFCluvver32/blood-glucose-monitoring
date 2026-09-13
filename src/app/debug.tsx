import { getAllMeals, Meal } from "@/db/database";
import { useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function DebugScreen() {
  const [rows, setRows] = useState<Meal[]>([]);

  async function fetchData() {
    const result = await getAllMeals();
    setRows(result);
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.scrollView}>
        <Pressable
          style={styles.refreshButton}
          onPress={() => {
            fetchData();
          }}
        >
          <Text style={{ color: "#ffffff" }}>Refresh</Text>
        </Pressable>
        {rows.map((aRow, i) => (
          <Text style={{ color: "#ffffff" }} key={i}>
            {JSON.stringify(aRow)}
          </Text>
        ))}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#17191F",
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  refreshButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
});
