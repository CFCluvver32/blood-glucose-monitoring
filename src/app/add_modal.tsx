import LogReadingTabs from "@/components/logging/LogReadingTab";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Pressable style={styles.closeButton} onPress={() => router.dismiss()}>
        <Ionicons name="close" size={28} color="#ffffff" />
      </Pressable>
      <Text style={styles.title}>Log reading</Text>
      <View style={{ flex: 1 }}>
        <LogReadingTabs />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#17191F",
    paddingHorizontal: 20,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  title: {
    marginTop: 14,
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subheading: {
    color: "#808080",
    fontSize: 14,
    marginBottom: 8,
  },
  valueBoxWrapper: {
    position: "relative",
  },
  valueBox: {
    fontSize: 62,
    fontWeight: "700",
    color: "#0DFF00",

    borderWidth: 2,
    borderColor: "#42454D",
    borderRadius: 10,
    backgroundColor: "#282C36",
    paddingHorizontal: 30,
    paddingTop: 5,
    paddingBottom: 5,
  },
  unitOverlay: {
    position: "absolute",
    right: 22,
    top: "50%",
    transform: [{ translateY: -12 }],
    color: "#0DFF00",
    fontSize: 18,
    fontWeight: "600",
  },
  contextWrapper: {
    marginTop: 20,
  },
  noteWrapper: {
    marginTop: -50,
  },
  note: {
    fontSize: 18,
    color: "#ffffff",
    borderWidth: 2,
    borderColor: "#42454D",
    backgroundColor: "#282C36",
    borderRadius: 10,
    padding: 20,
    height: 64,
    textAlignVertical: "top",
  },
  keypad: {
    marginTop: 20,
  },
  submitButton: {
    //marginTop: -40,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00ff7f",
  },
  submitText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    padding: 16,
  },
});
