import ContextSelector from "@/components/ContextSelector";
import NumberKeyPad from "@/components/NumberKeyPad";
import { useReadings } from "@/context/ReadingsContext";
import { insertReading, ThresholdType, updateReading } from "@/db/database";
import { formatDateTime } from "@/utils/date";
import Entypo from "@expo/vector-icons/Entypo";
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

export default function GlucoseTab() {
  const { readings, refreshReadings } = useReadings();
  const { readingId } = useLocalSearchParams<{ readingId?: string }>();

  // Searches the readings to find the Reading object with a matching id, if readingId is populated. Otherwise, returns undefined.
  // Used to edit a glucose reading.
  const existingReading = readingId
    ? readings.find((reading) => reading.id == Number(readingId))
    : undefined;

  const [number, setNumber] = useState<string>(
    existingReading ? String(existingReading.glucoseReading) : "",
  );
  const [context, setContext] =
    useState<ThresholdType | "">(existingReading?.type as ThresholdType) ?? "";

  const [note, setNote] = useState<string>(existingReading?.note ?? "");

  const clearGlucoseReading = () => {
    setNumber("");
  };

  const clearNote = () => {
    setNote("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subheading}>BLOOD GLUCOSE READING</Text>
      <View style={styles.valueBoxWrapper}>
        <TextInput
          style={styles.valueBox}
          value={number}
          editable={false}
          placeholder="0.0"
          placeholderTextColor={"#4f4f4f"}
        />
        {number && (
          <Pressable style={styles.clearButton} onPress={clearGlucoseReading}>
            <Entypo name="circle-with-cross" size={20} color="white" />
          </Pressable>
        )}

        <Text style={styles.unitOverlay}>mmol/L</Text>
      </View>
      <View style={styles.contextWrapper}>
        <Text style={styles.subheading}>CONTEXT</Text>
        <ContextSelector value={context} onChange={setContext} />
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
      <View style={styles.keypad}>
        <NumberKeyPad value={number} onChange={setNumber} />
      </View>
      <Pressable
        onPress={async () => {
          if (!number && !context) {
            Alert.alert(
              "Additional information required",
              "You must supply a valid blood glucose reading and a context to log a reading.",
            );
            return;
          } else if (!number) {
            Alert.alert(
              "Reading required",
              "You must supply a valid blood glucose reading to log a reading.",
            );
            return;
          } else if (!context) {
            Alert.alert(
              "Context required",
              "You must select a context to log a reading.",
            );
            return;
          }

          if (existingReading) {
            await updateReading(
              existingReading.id,
              parseFloat(number),
              context,
              note,
            );
          } else {
            await insertReading(
              parseFloat(number),
              formatDateTime(),
              context,
              note,
            );
          }
          await refreshReadings();
          router.dismiss();
        }}
      >
        <LinearGradient
          colors={["#0fe500", "#267d2a", "#003705"]}
          style={styles.submitButton}
        >
          <Text style={styles.submitText}>
            {existingReading ? "UPDATE" : "SUBMIT"}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subheading: {
    color: "#808080",
    fontSize: 14,
    marginBottom: 8,
  },
  valueBoxWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  valueBox: {
    fontSize: 62,
    fontWeight: "700",
    color: "#0DFF00",
    borderWidth: 1.5,
    borderColor: "#42454D",
    borderRadius: 10,
    backgroundColor: "#282C36",
    paddingHorizontal: 30,
    paddingTop: 5,
    paddingBottom: 5,
  },
  clearButton: {
    position: "absolute",
    right: 16,
    justifyContent: "center",
  },
  unitOverlay: {
    position: "absolute",
    right: 50,
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
  keypad: {
    marginTop: 20,
  },
  submitButton: {
    marginTop: -45,
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
