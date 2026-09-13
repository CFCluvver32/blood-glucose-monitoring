import { useReadings } from "@/context/ReadingsContext";
import { insertExercise, updateExercise } from "@/db/database";
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
import ExerciseSelector from "../ExerciseSelector";
import IntensitySelector from "../IntensitySelector";

export default function ExerciseTab() {
  const { exercises, refreshExercises } = useReadings();
  const { exerciseId } = useLocalSearchParams<{ exerciseId?: string }>();

  // Searches the logged exercises to find the Exercise object with a matching id, if exerciseId is populated. Otherwise, returns undefined.
  // Used to edit an exercise workout.
  const existingExercise = exerciseId
    ? exercises.find((exercise) => exercise.id === Number(exerciseId))
    : undefined;

  const [activityType, setActivityType] = useState<string | "">(
    existingExercise?.activityType ?? "",
  );

  const [duration, setDuration] = useState<number>(
    existingExercise?.duration ?? 0,
  );

  const [intensity, setIntensity] = useState<string>(
    existingExercise?.intensity ?? "",
  );
  const [note, setNote] = useState<string>(existingExercise?.note ?? "");

  const clearNote = () => {
    setNote("");
  };

  return (
    <View style={styles.exerciseContainer}>
      <Text style={styles.subheading}>ACTIVITY TYPE</Text>
      <ExerciseSelector value={activityType} onChange={setActivityType} />
      <View style={styles.durationContainer}>
        <Text style={styles.subheading}>DURATION</Text>
        <View style={styles.durationWrapper}>
          <Pressable
            style={({ pressed }) => [
              styles.durationButton,
              pressed && styles.durationButtonPressed,
            ]}
            onPress={() => setDuration((prev) => Math.max(0, prev - 5))}
          >
            <Text style={styles.durationButtonText}>-</Text>
          </Pressable>
          <View style={styles.durationValueWrapper}>
            <Text style={styles.durationValue}>{duration}</Text>
            <Text style={styles.durationUnit}> mins</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.durationButton,
              pressed && styles.durationButtonPressed,
            ]}
            onPress={() => setDuration((prev) => prev + 5)}
          >
            <Text style={styles.durationButtonText}>+</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.intensityContainer}>
        <Text style={styles.subheading}>INTENSITY</Text>
        <View>
          <IntensitySelector value={intensity} onChange={setIntensity} />
        </View>
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
      <Pressable
        style={styles.submitWrapper}
        onPress={async () => {
          if (!activityType && !duration && !intensity) {
            Alert.alert(
              "Additional information required",
              "You must supply the activity type, duration, and the intesity to log the exercise.",
            );
            return;
          } else if (!activityType) {
            Alert.alert(
              "Activity type required",
              "You must supply an activity type to log the exercise.",
            );
            return;
          } else if (!duration) {
            Alert.alert(
              "Duration required",
              "You must specify the duration to log the exercise.",
            );
            return;
          } else if (!intensity) {
            Alert.alert(
              "Intensity required",
              "You must specify the intesity to log the exercise.",
            );
            return;
          }

          if (existingExercise) {
            await updateExercise(
              existingExercise.id,
              activityType,
              duration,
              intensity,
              note,
            );
          } else {
            await insertExercise(
              null,
              activityType,
              duration,
              intensity,
              note,
              formatDateTime(),
            );
          }
          await refreshExercises();
          router.dismiss();
        }}
      >
        <LinearGradient
          colors={["#0fe500", "#267d2a", "#003705"]}
          style={styles.submitButton}
        >
          <Text style={styles.submitText}>
            {existingExercise ? "UPDATE" : "SUBMIT"}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseContainer: {
    flex: 1,
  },
  subheading: {
    color: "#808080",
    fontSize: 14,
    marginBottom: 8,
  },
  durationContainer: {
    marginTop: 20,
  },
  durationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#282C36",
    borderWidth: 1.5,
    borderColor: "#42454D",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  durationButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#3A3E48",
    borderWidth: 1,
    borderColor: "#464952",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  durationButtonPressed: {
    backgroundColor: "#4f535e",
  },
  durationButtonText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "600",
  },
  durationValueWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
  },
  durationValue: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
  },
  durationUnit: {
    color: "#808080",
    fontSize: 15,
    fontWeight: "600",
  },
  textInput: {
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
  intensityContainer: {
    marginTop: 20,
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
  clearButton: {
    position: "absolute",
    right: 16,
    justifyContent: "center",
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
