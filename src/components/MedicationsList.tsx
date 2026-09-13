import { useReadings } from "@/context/ReadingsContext";
import { Medication, deleteMedication } from "@/db/database";
import { formatDate, formatLongDate } from "@/utils/date";
import Entypo from "@expo/vector-icons/Entypo";
import Octicons from "@expo/vector-icons/Octicons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import DetailsRow from "./DetailsRow";

interface MedicationsListProps {
  medications: Medication[];
}

// Groups an array of medications by their recorded date.
// Date is sliced and used as the key for the dictionary, the value is the array of medications.
// If the key already exists within the dictionary, the Medication is pushed to the array. If not, a new key-value pair is created.
const groupMedicationsByDate = (
  medications: Medication[],
): Record<string, Medication[]> => {
  const groupedMedications: Record<string, Medication[]> = {};
  medications.forEach((aMedication) => {
    const key = aMedication.timeTaken.slice(0, 10);
    if (key in groupedMedications) {
      groupedMedications[key].push(aMedication);
    } else {
      groupedMedications[key] = [aMedication];
    }
  });
  return groupedMedications;
};

// Returns a display heading corresponding to the date the medication was logged.
// Returns "Today" or "Yesterday" for the current and previous day, otherwise returns the date unchanged.
const getDateHeading = (date: string) => {
  const dateToday = new Date();

  const dateYesterday = new Date();
  dateYesterday.setDate(dateYesterday.getDate() - 1);

  if (date === formatDate(dateToday)) return "Today";
  if (date === formatDate(dateYesterday)) return "Yesterday";
  return formatLongDate(date);
};

const formatDosageUnit = (dose: number, unit: string) => {
  if (unit === "units") return `${dose} unit(s)`;
  else return `${dose}${unit}`;
};

export default function MedicationsList({ medications }: MedicationsListProps) {
  const { refreshMedications } = useReadings();
  const [openMedicationId, setOpenMedicationId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Delete Medication",
      "Are you sure you want to delete this medication?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteMedication(id);
            await refreshMedications();
            setOpenMedicationId(null);
          },
        },
      ],
    );
  };

  const grouped = groupMedicationsByDate(medications);
  return (
    <View>
      {Object.keys(grouped).map((date) => (
        <View key={date}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionDate}>{getDateHeading(date)}</Text>
            <View style={styles.sectionLine} />
          </View>
          {grouped[date].map((aMedication) => {
            return (
              <View key={aMedication.id}>
                <Pressable
                  style={[
                    styles.medicationItem,
                    openMedicationId === aMedication.id &&
                      styles.medicationItemSelected,
                  ]}
                  onPress={() => {
                    setOpenMedicationId(
                      openMedicationId === aMedication.id
                        ? null
                        : aMedication.id,
                    );
                  }}
                >
                  <View style={styles.time}>
                    <Text style={styles.timeText}>
                      {aMedication.timeTaken.slice(11, 16)}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.medicationText}>
                    <Text style={styles.medicationName}>
                      {aMedication.medicationName}
                    </Text>
                    <View style={styles.doseBadge}>
                      <Text style={styles.doseBadgeText}>
                        {formatDosageUnit(
                          aMedication.dose,
                          aMedication.unitOfMeasure,
                        )}
                      </Text>
                    </View>
                  </View>
                  <Octicons
                    name={
                      openMedicationId === aMedication.id
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={20}
                    color="white"
                  />
                </Pressable>
                {openMedicationId === aMedication.id && (
                  <View style={styles.detailsPanel}>
                    <DetailsRow
                      label="Medication"
                      value={aMedication.medicationName}
                      showDivider={true}
                    />
                    <DetailsRow
                      label="Dose"
                      value={formatDosageUnit(
                        aMedication.dose,
                        aMedication.unitOfMeasure,
                      )}
                      showDivider={true}
                    />
                    {aMedication.note && (
                      <DetailsRow
                        label="Note"
                        value={aMedication.note}
                        showDivider={true}
                      />
                    )}
                    <DetailsRow
                      label="Time taken"
                      value={aMedication.timeTaken.slice(11, 16)}
                      showDivider={false}
                    />
                    <View style={styles.buttonsRow}>
                      <Pressable
                        style={styles.editButton}
                        onPress={() =>
                          router.push({
                            pathname: "/add_modal",
                            params: {
                              tab: "Medication",
                              medicationId: String(aMedication.id),
                            },
                          })
                        }
                      >
                        <Octicons name="pencil" size={18} color="#3b9eff" />
                        <Text style={styles.editButtonText}>
                          Edit medication
                        </Text>
                      </Pressable>
                      <Pressable
                        style={styles.deleteButton}
                        onPress={() => handleDelete(aMedication.id)}
                      >
                        <Entypo name="cross" size={20} color="#ff5c5c" />
                        <Text style={styles.deleteButtonText}>
                          Delete medication
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
  medicationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#17191F",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  medicationItemSelected: {
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: "#42454D",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 0,
  },
  time: {
    width: 64,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#16324a",
  },
  timeText: {
    color: "#ffffff",
    width: 60,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
    textAlign: "center",
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: "#42454D",
    marginHorizontal: 16,
  },
  medicationText: {
    flex: 1,
    marginLeft: 10,
    marginRight: 20,
  },
  medicationName: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "700",
  },
  doseBadge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#2e4d63",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 6,
  },
  doseBadgeText: {
    color: "#7db8e8",
    fontWeight: "600",
    fontSize: 14,
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
    gap: 4,
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
    gap: 2,
    marginTop: 16,
    padding: 10,
  },
  deleteButtonText: {
    color: "#ff5c5c",
    fontSize: 16,
    fontWeight: "700",
  },
});
