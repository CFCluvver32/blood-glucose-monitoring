import { useReadings } from "@/context/ReadingsContext";
import { Exercise, deleteExercise } from "@/db/database";
import { formatDate, formatLongDate } from "@/utils/date";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import DetailsRow from "./DetailsRow";

interface ExercisesListProps {
  exercises: Exercise[];
}

// Groups an array of exercises by their recorded date.
// Date is sliced and used as the key for the dictionary, the value is the array of exercises.
// If the key already exists within the dictionary, the exercise is pushed to the array. If not, a new key-value pair is created.
const groupExercisesByDate = (
  exercises: Exercise[],
): Record<string, Exercise[]> => {
  const groupedExercises: Record<string, Exercise[]> = {};
  exercises.forEach((anExercise) => {
    const key = anExercise.recordedAt.slice(0, 10);
    if (key in groupedExercises) {
      groupedExercises[key].push(anExercise);
    } else {
      groupedExercises[key] = [anExercise];
    }
  });
  return groupedExercises;
};

// Returns a display heading corresponding to the date the meal was logged.
// Returns "Today" or "Yesterday" for the current and previous day, otherwise returns the date unchanged.
const getDateHeading = (date: string) => {
  const dateToday = new Date();

  const dateYesterday = new Date();
  dateYesterday.setDate(dateYesterday.getDate() - 1);

  if (date === formatDate(dateToday)) return "Today";
  if (date === formatDate(dateYesterday)) return "Yesterday";
  return formatLongDate(date);
};

export default function ExercisesList({ exercises }: ExercisesListProps) {
  const { refreshExercises } = useReadings();
  const [openExerciseId, setOpenExerciseId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Delete exercise",
      "Are you sure you want to delete this exercise?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteExercise(id);
            await refreshExercises();
            setOpenExerciseId(null);
          },
        },
      ],
    );
  };

  const grouped = groupExercisesByDate(exercises);
  return (
    <View>
      {Object.keys(grouped).map((date) => (
        <View key={date}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionDate}>{getDateHeading(date)}</Text>
            <View style={styles.sectionLine} />
          </View>
          {grouped[date].map((anExercise) => {
            return (
              <View key={anExercise.id}>
                <Pressable
                  style={[
                    styles.mealItem,
                    openExerciseId === anExercise.id && styles.mealItemSelected,
                  ]}
                  onPress={() => {
                    setOpenExerciseId(
                      openExerciseId === anExercise.id ? null : anExercise.id,
                    );
                  }}
                >
                  <View style={styles.icon}>
                    <Ionicons name="restaurant" size={22} color="#e8b98a" />
                  </View>
                  <View style={styles.mealText}>
                    <Text style={styles.mealName}>
                      {anExercise.activityType}
                    </Text>
                    <Text style={styles.subtext}>
                      {`${anExercise.recordedAt.slice(11, 16)} · ${anExercise.duration} mins · ${anExercise.intensity}`}
                    </Text>
                  </View>

                  <Octicons
                    name={
                      openExerciseId === anExercise.id
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={20}
                    color="white"
                  />
                </Pressable>
                {openExerciseId === anExercise.id && (
                  <View style={styles.detailsPanel}>
                    <DetailsRow
                      label="Exercise type"
                      value={anExercise.activityType}
                      showDivider={true}
                    />
                    <DetailsRow
                      label="Duration"
                      value={`${anExercise.duration} minutes`}
                      showDivider={true}
                    />
                    <DetailsRow
                      label="Intensity"
                      value={anExercise.intensity}
                      showDivider={true}
                    />
                    {anExercise.note && (
                      <DetailsRow
                        label="Note"
                        value={anExercise.note}
                        showDivider={true}
                      />
                    )}
                    <DetailsRow
                      label="Time recorded"
                      value={anExercise.recordedAt.slice(11, 16)}
                      showDivider={false}
                    />
                    <View style={styles.buttonsRow}>
                      <Pressable
                        style={styles.editButton}
                        onPress={() =>
                          router.push({
                            pathname: "/add_modal",
                            params: {
                              tab: "Exercise",
                              exerciseId: String(anExercise.id),
                            },
                          })
                        }
                      >
                        <Octicons name="pencil" size={18} color="#3b9eff" />
                        <Text style={styles.editButtonText}>Edit exercise</Text>
                      </Pressable>
                      <Pressable
                        style={styles.deleteButton}
                        onPress={() => handleDelete(anExercise.id)}
                      >
                        <Entypo name="cross" size={20} color="#ff5c5c" />
                        <Text style={styles.deleteButtonText}>
                          Delete exercise
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  sectionDate: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  sectionLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ffffff",
    marginLeft: 15,
  },
  mealItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#17191F",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  mealItemSelected: {
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: "#42454D",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 0,
  },
  icon: {
    width: 55,
    height: 55,
    borderRadius: 12,
    backgroundColor: "#4a0137",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  mealText: {
    flex: 1,
    marginLeft: 20,
    marginRight: 10,
  },
  mealName: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "700",
  },
  subtext: {
    color: "#8a8f98",
    fontSize: 15,
    marginTop: 3,
  },
  time: {
    color: "#ffffff",
    width: 60,
    fontSize: 18,
    textAlign: "center",
  },
  displayBar: {
    backgroundColor: "#ffffff",
    flex: 1,
    height: 10,
    marginHorizontal: 10,
  },
  type: {
    marginHorizontal: 10,
    color: "#ffffff",
    width: 90,
    fontSize: 18,
    textAlign: "center",
  },
  detailsPanel: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#121319",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#42454D",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ADADAD",
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#3b9eff",
    backgroundColor: "#16324a",
    gap: 10,
    marginTop: 16,
    padding: 10,
  },
  editButtonText: {
    color: "#3b9eff",
    fontSize: 16,
    fontWeight: "700",
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#ff5c5c",
    backgroundColor: "#3a1717",
    gap: 10,
    marginTop: 16,
    padding: 10,
  },
  deleteButtonText: {
    color: "#ff5c5c",
    fontSize: 16,
    fontWeight: "700",
  },
});
