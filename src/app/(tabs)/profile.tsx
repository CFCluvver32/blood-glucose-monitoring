import CollapsibleSection from "@/components/CollapsibleSection";
import GlucoseThreshold from "@/components/GlucoseThreshold";
import NameCard from "@/components/NameCard";
import { useReadings } from "@/context/ReadingsContext";
import { deleteAllData } from "@/db/database";
import { shareCSVExport, shareJSONExport } from "@/services/exportService";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const {
    refreshReadings,
    refreshMeals,
    refreshExercises,
    refreshMedications,
  } = useReadings();

  const toggleSection = (title: string) => {
    setOpenSection((prev) => (prev === title ? null : title));
  };

  const handlePress = () => {
    Alert.alert(
      "Delete all data?",
      "This will permanently delete all of your logged glucose readings, meals, exercises, and medication.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", style: "destructive", onPress: confirmDelete },
      ],
    );
  };

  const confirmDelete = () => {
    Alert.alert(
      "Are you sure?",
      "This cannot be undone. All application data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleDelete },
      ],
    );
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAllData();
      await refreshReadings();
      await refreshMeals();
      await refreshExercises();
      await refreshMedications();
    } catch (error) {
      Alert.alert(
        "Something went wrong",
        "Your data could not be deleted. Please try again.",
      );
      console.error("Data deletion failed", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Profile</Text>
        <NameCard />
        <CollapsibleSection
          title="GLUCOSE THRESHOLDS"
          isOpen={openSection === "GLUCOSE THRESHOLDS"}
          onToggle={() => toggleSection("GLUCOSE THRESHOLDS")}
        >
          <Text style={styles.collapsibleSectionText}>
            Target thresholds (mmol/L) for each context.
          </Text>
          <GlucoseThreshold
            title="Pre-meal"
            primaryColour="#1d6264c9"
            secondaryColour="#00f7ff"
          />
          <GlucoseThreshold
            title="Post-meal"
            primaryColour="#985711ba"
            secondaryColour="#ff9811"
          />
          <GlucoseThreshold
            title="Exercise"
            primaryColour="#d900ff2a"
            secondaryColour="#d900ff"
          />
          <GlucoseThreshold
            title="Fasting"
            primaryColour="#2f7c18a5"
            secondaryColour="#4eff5a"
          />
        </CollapsibleSection>
        <CollapsibleSection
          title="REMINDERS"
          isOpen={openSection === "REMINDERS"}
          onToggle={() => toggleSection("REMINDERS")}
        >
          <Text style={styles.collapsibleSectionText}>
            Set up reminders for medication, meals, and other activities.
          </Text>
        </CollapsibleSection>
        <CollapsibleSection
          title="EXPORT HEALTH DATA"
          isOpen={openSection === "EXPORT HEALTH DATA"}
          onToggle={() => toggleSection("EXPORT HEALTH DATA")}
        >
          <Text style={styles.collapsibleSectionText}>
            Export your health data in CSV/JSON format.
          </Text>
          <View style={styles.exportOptionsRow}>
            <Pressable style={styles.exportOption} onPress={shareCSVExport}>
              <MaterialCommunityIcons
                name="file-delimited-outline"
                size={20}
                color="#3eec6f"
              />
              <Text style={styles.exportOptionText}>CSV</Text>
              <Text style={styles.exportOptionSubtext}>Spreadsheet</Text>
            </Pressable>
            <Pressable
              style={[styles.exportOption, styles.exportOptionJSON]}
              onPress={shareJSONExport}
            >
              <MaterialCommunityIcons
                name="code-json"
                size={20}
                color="#f5921e"
              />
              <Text
                style={[styles.exportOptionText, styles.exportOptionTextJSON]}
              >
                JSON
              </Text>
              <Text style={styles.exportOptionSubtext}>Full backup</Text>
            </Pressable>
          </View>
        </CollapsibleSection>
        <CollapsibleSection
          title="DELETE HEALTH DATA"
          isOpen={openSection === "DELETE HEALTH DATA"}
          onToggle={() => toggleSection("DELETE HEALTH DATA")}
        >
          <Text style={styles.collapsibleSectionText}>
            Delete all of your health data from this application.
          </Text>
          <Pressable onPress={handlePress} disabled={isDeleting}>
            <LinearGradient
              colors={["#ff2e2e", "#bb1d1d", "#4e0000"]}
              style={styles.button}
            >
              {isDeleting ? (
                <ActivityIndicator color="#dc2626" />
              ) : (
                <View style={styles.buttonContent}>
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={22}
                    color="#ffffff"
                  />
                  <Text style={styles.label}>Delete all data!</Text>
                </View>
              )}
            </LinearGradient>
          </Pressable>
        </CollapsibleSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#0a0c0f",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  title: {
    marginTop: 14,
    marginBottom: 20,
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff",
    paddingHorizontal: 20,
  },
  avatarWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "#2E4A24",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#6CFF6C",
  },
  avatarBadge: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0fe500",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#0a0c0f",
  },
  preview: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  previewText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
  },
  inputsWrapper: {
    gap: 12,
  },
  nameWrapper: {
    marginHorizontal: 20,
    backgroundColor: "#1b1d21",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#42454D",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    backgroundColor: "#0a0c0f",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 18,
  },
  collapsibleSectionText: {
    color: "#808080",
    fontSize: 16,
    marginBottom: 20,
  },
  exportOptionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  exportOption: {
    width: "48%",
    minHeight: 96,
    borderRadius: 10,
    borderStyle: "dashed",
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderWidth: 2,
    borderColor: "#3eec6f",
    backgroundColor: "#282C36",
  },
  exportOptionJSON: {
    borderColor: "#f5921e",
  },
  exportOptionText: {
    color: "#3eec6f",
    fontSize: 18,
    fontWeight: "700",
  },
  exportOptionTextJSON: {
    color: "#f5921e",
  },
  exportOptionSubtext: {
    color: "#8b97a3",
    fontSize: 12,
    fontWeight: "500",
    marginTop: -4,
  },
  button: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
});
