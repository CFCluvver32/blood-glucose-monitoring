import { useReadings } from "@/context/ReadingsContext";
import { deleteMeal, Meal } from "@/db/database";
import { formatDate, formatLongDate } from "@/utils/date";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import DetailsRow from "./DetailsRow";

interface MealsListProps {
  meals: Meal[];
}

// Groups an array of meals by their recorded date.
// Date is sliced and used as the key for the dictionary, the value is the array of meals.
// If the key already exists within the dictionary, the meal is pushed to the array. If not, a new key-value pair is created.
const groupMealsByDate = (meals: Meal[]): Record<string, Meal[]> => {
  const groupedMeals: Record<string, Meal[]> = {};
  meals.forEach((aMeal) => {
    const key = aMeal.recordedAt.slice(0, 10);
    if (key in groupedMeals) {
      groupedMeals[key].push(aMeal);
    } else {
      groupedMeals[key] = [aMeal];
    }
  });
  return groupedMeals;
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

export default function MealsList({ meals }: MealsListProps) {
  const { refreshMeals } = useReadings();
  const [openMealId, setOpenMealId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    Alert.alert("Delete meal", "Are you sure you want to delete this meal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteMeal(id);
          await refreshMeals();
          setOpenMealId(null);
        },
      },
    ]);
  };

  const grouped = groupMealsByDate(meals);
  return (
    <View>
      {Object.keys(grouped).map((date) => (
        <View key={date}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionDate}>{getDateHeading(date)}</Text>
            <View style={styles.sectionLine} />
          </View>
          {grouped[date].map((aMeal) => {
            return (
              <View key={aMeal.id}>
                <Pressable
                  style={[
                    styles.mealItem,
                    openMealId === aMeal.id && styles.mealItemSelected,
                  ]}
                  onPress={() => {
                    setOpenMealId(openMealId === aMeal.id ? null : aMeal.id);
                  }}
                >
                  <View style={styles.icon}>
                    {aMeal.photo ? (
                      <Image
                        source={{ uri: aMeal.photo }}
                        style={styles.photo}
                      />
                    ) : (
                      <Ionicons name="restaurant" size={22} color="#e8b98a" />
                    )}
                  </View>
                  <View style={styles.mealText}>
                    <Text style={styles.mealName}>{aMeal.mealName}</Text>
                    <Text style={styles.subtext}>
                      {`${aMeal.recordedAt.slice(11, 16)} · ${aMeal.mealType}`}
                    </Text>
                  </View>

                  <Octicons
                    name={
                      openMealId === aMeal.id ? "chevron-up" : "chevron-down"
                    }
                    size={20}
                    color="white"
                  />
                </Pressable>
                {openMealId === aMeal.id && (
                  <View style={styles.detailsPanel}>
                    <DetailsRow
                      label="Meal"
                      value={aMeal.mealName}
                      showDivider={true}
                    />
                    <DetailsRow
                      label="Meal type"
                      value={aMeal.mealType}
                      showDivider={true}
                    />
                    {aMeal.note && (
                      <DetailsRow
                        label="Note"
                        value={aMeal.note}
                        showDivider={true}
                      />
                    )}
                    <DetailsRow
                      label="Time recorded"
                      value={aMeal.recordedAt.slice(11, 16)}
                      showDivider={false}
                    />
                    {aMeal.photo && (
                      <Image
                        source={{ uri: aMeal.photo }}
                        style={styles.detailsPhoto}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.buttonsRow}>
                      <Pressable
                        style={styles.editButton}
                        onPress={() =>
                          router.push({
                            pathname: "/add_modal",
                            params: { tab: "Food", mealId: String(aMeal.id) },
                          })
                        }
                      >
                        <Octicons name="pencil" size={18} color="#3b9eff" />
                        <Text style={styles.editButtonText}>Edit meal</Text>
                      </Pressable>
                      <Pressable
                        style={styles.deleteButton}
                        onPress={() => handleDelete(aMeal.id)}
                      >
                        <Entypo name="cross" size={20} color="#ff5c5c" />
                        <Text style={styles.deleteButtonText}>Delete meal</Text>
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
  detailsPhoto: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 12,
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
