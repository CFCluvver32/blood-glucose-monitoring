import { useReadings } from "@/context/ReadingsContext";
import {
  insertMedication,
  UnitOfMeasure,
  updateMedication,
} from "@/db/database";
import { formatDateTime } from "@/utils/date";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function MedicationTab() {
  const { medications, refreshMedications } = useReadings();
  const { medicationId } = useLocalSearchParams<{ medicationId?: string }>();

  // Searches the logged medications to find the Medication object with a matching id, if medicationId is populated. Otherwise, returns undefined.
  // Used to edit a medication.
  const existingMedication = medicationId
    ? medications.find((medication) => medication.id === Number(medicationId))
    : undefined;

  const [medicationName, setMedicationName] = useState<string>(
    existingMedication?.medicationName ?? "",
  );

  const [dose, setDose] = useState<string>(
    existingMedication ? String(existingMedication.dose) : "",
  );
  const [unitOfMeasure, setUnitOfMeasure] = useState<UnitOfMeasure>(
    existingMedication?.unitOfMeasure ?? "units",
  );

  const [selectedTime, setSelectedTime] = useState(
    existingMedication ? new Date(existingMedication.timeTaken) : new Date(),
  );

  const [isNow, setIsNow] = useState<boolean>(false);

  const [note, setNote] = useState<string>(existingMedication?.note ?? "");

  const clearMedicationName = () => {
    setMedicationName("");
  };

  const clearDose = () => {
    setDose("");
  };

  const clearNote = () => {
    setNote("");
  };

  return (
    <View style={styles.medicationContainer}>
      <Text style={styles.subheading}>MEDICATION</Text>
      <View style={styles.medicationInputWrapper}>
        <TextInput
          style={styles.medication}
          value={medicationName}
          multiline={true}
          placeholder="e.g. Metformin"
          placeholderTextColor={"#4f4f4f"}
          onChangeText={setMedicationName}
        />
        {medicationName && (
          <Pressable style={styles.clearButton} onPress={clearMedicationName}>
            <Entypo name="circle-with-cross" size={20} color="white" />
          </Pressable>
        )}
      </View>
      <View style={styles.doseWrapper}>
        <Text style={styles.subheading}>DOSE</Text>
        <View style={styles.doseRow}>
          <View style={styles.doseInput}>
            <TextInput
              style={styles.dose}
              value={dose}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={"#4f4f4f"}
              onChangeText={setDose}
            />
            {dose && (
              <Pressable style={styles.clearButton} onPress={clearDose}>
                <Entypo name="circle-with-cross" size={20} color="white" />
              </Pressable>
            )}
          </View>
          <View style={styles.units}>
            <Pressable
              style={[
                styles.unitOption,
                unitOfMeasure === "units" && styles.unitOptionSelected,
              ]}
              onPress={() => setUnitOfMeasure("units")}
            >
              <Text
                style={[
                  styles.unitText,
                  unitOfMeasure === "units" && styles.unitTextSelected,
                ]}
              >
                units
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.unitOption,
                unitOfMeasure === "mg" && styles.unitOptionSelected,
              ]}
              onPress={() => setUnitOfMeasure("mg")}
            >
              <Text
                style={[
                  styles.unitText,
                  unitOfMeasure === "mg" && styles.unitTextSelected,
                ]}
              >
                mg
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.unitOption,
                unitOfMeasure === "mcg" && styles.unitOptionSelected,
              ]}
              onPress={() => setUnitOfMeasure("mcg")}
            >
              <Text
                style={[
                  styles.unitText,
                  unitOfMeasure === "mcg" && styles.unitTextSelected,
                ]}
              >
                mcg
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.unitOption,
                unitOfMeasure === "mL" && styles.unitOptionSelected,
              ]}
              onPress={() => setUnitOfMeasure("mL")}
            >
              <Text
                style={[
                  styles.unitText,
                  unitOfMeasure === "mL" && styles.unitTextSelected,
                ]}
              >
                mL
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.timeWrapper}>
          <Text style={styles.subheading}>TIME TAKEN</Text>
          <View style={styles.timeRow}>
            {!isNow && (
              <View style={styles.timePickerContainer}>
                <DateTimePicker
                  value={selectedTime}
                  onValueChange={(event, newTime) => {
                    setSelectedTime(newTime);
                  }}
                  mode="time"
                  themeVariant="dark"
                  display="spinner"
                />
              </View>
            )}
            <Pressable
              style={[styles.nowOption, isNow && styles.nowOptionSelected]}
              onPress={() => setIsNow((prev) => !prev)}
            >
              <Text style={[styles.nowLabel, isNow && styles.nowLabelSelected]}>
                Now
              </Text>
              {!isNow && (
                <MaterialCommunityIcons
                  name="checkbox-blank-outline"
                  size={24}
                  color="white"
                />
              )}
              <View>
                {isNow && (
                  <MaterialCommunityIcons
                    name="checkbox-outline"
                    size={24}
                    color="white"
                  />
                )}
              </View>
            </Pressable>
          </View>
          <View style={styles.noteWrapper}>
            <Text style={styles.subheading}>NOTE (OPTIONAL)</Text>
            <View style={styles.noteInputWrapper}>
              <TextInput
                style={styles.note}
                value={note}
                multiline={true}
                placeholder="Add a note..."
                placeholderTextColor={"#4f4f4f"}
                onChangeText={setNote}
              />
              {note && (
                <Pressable style={styles.clearButton} onPress={clearNote}>
                  <Entypo name="circle-with-cross" size={20} color="white" />
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
      <Pressable
        style={styles.submitWrapper}
        onPress={async () => {
          if (!medicationName && !dose) {
            Alert.alert(
              "Additional information required",
              "You must supply a medication name and a dose to log medication.",
            );
            return;
          } else if (!medicationName) {
            Alert.alert(
              "Medication name required",
              "You must supply a medication name to log medication.",
            );
            return;
          } else if (!dose) {
            Alert.alert(
              "Dose required",
              "You must supply a dose to log medication.",
            );
            return;
          }
          const timeTaken = isNow
            ? formatDateTime()
            : formatDateTime(selectedTime);

          if (existingMedication) {
            await updateMedication(
              existingMedication.id,
              medicationName,
              Number(dose),
              unitOfMeasure,
              timeTaken,
              note,
            );
          } else {
            await insertMedication(
              null,
              medicationName,
              Number(dose),
              unitOfMeasure,
              timeTaken,
              note,
            );
          }
          await refreshMedications();
          router.dismiss();
        }}
      >
        <LinearGradient
          colors={["#0fe500", "#267d2a", "#003705"]}
          style={styles.submitButton}
        >
          <Text style={styles.submitText}>
            {existingMedication ? "UPDATE" : "SUBMIT"}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  medicationContainer: {
    flex: 1,
  },
  subheading: {
    color: "#808080",
    fontSize: 14,
    marginBottom: 8,
  },
  medicationInputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  medication: {
    fontSize: 18,
    color: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#42454D",
    backgroundColor: "#282C36",
    borderRadius: 10,
    padding: 20,
    height: 64,
    textAlignVertical: "top",
  },
  clearButton: {
    position: "absolute",
    right: 16,
    justifyContent: "center",
  },
  doseWrapper: {
    marginTop: 20,
  },
  doseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  doseInput: {
    position: "relative",
    justifyContent: "center",
    width: "30%",
  },
  dose: {
    fontSize: 18,
    color: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#42454D",
    backgroundColor: "#282C36",
    borderRadius: 10,
    padding: 20,
    height: 64,
    textAlignVertical: "top",
  },
  units: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#0a0c0f",
    borderRadius: 14,
    padding: 4,
    height: 64,
  },
  unitOption: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  unitOptionSelected: {
    backgroundColor: "#282C36",
    borderWidth: 2,
    borderColor: "#3eec6f",
  },
  unitText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#808080",
  },
  unitTextSelected: {
    color: "#3eec6f",
    fontWeight: "700",
  },
  timeWrapper: {
    marginTop: 20,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  timePickerContainer: {
    flex: 1,
    backgroundColor: "#0a0c0f",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#42454D",
    overflow: "hidden",
  },
  nowOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#282C36",
    borderWidth: 1.5,
    borderColor: "#42454D",
  },
  nowOptionPushRight: {
    marginLeft: "auto",
  },
  nowOptionSelected: {
    borderColor: "#3eec6f",
    backgroundColor: "#31dd6d68",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#808080",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#3eec6f",
    borderColor: "#3eec6f",
  },
  nowLabel: {
    color: "#808080",
    fontSize: 15,
    fontWeight: "600",
  },
  nowLabelSelected: {
    color: "#3eec6f",
    fontWeight: "700",
  },
  noteWrapper: {
    marginTop: 20,
  },
  noteInputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  note: {
    fontSize: 18,
    color: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#42454D",
    backgroundColor: "#282C36",
    borderRadius: 10,
    padding: 20,
    height: 64,
    textAlignVertical: "top",
  },
  submitWrapper: {
    marginTop: "auto",
  },
  submitButton: {
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
