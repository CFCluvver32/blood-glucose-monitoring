import { useReadings } from "@/context/ReadingsContext";
import { useSettings } from "@/context/SettingsContext";
import { deleteReading, Reading } from "@/db/database";
import { formatDate, formatLongDate } from "@/utils/date";
import Entypo from "@expo/vector-icons/Entypo";
import Octicons from "@expo/vector-icons/Octicons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import DetailsRow from "./DetailsRow";
import GlucoseBar from "./GlucoseBar";

interface ReadingListProps {
  readings: Reading[];
}

// Determines the appropriate colour to display based on user thresholds; green for a normal reading, orange if outside range.
const handleColourDisplay = (
  glucoseReading: number,
  threshold: { lowValue: number; highValue: number },
) => {
  if (
    glucoseReading < threshold.lowValue ||
    glucoseReading > threshold.highValue
  ) {
    return "#ff8400";
  }
  return "#0fe500";
};

// Groups an array of readings by their recorded date.
// Date is sliced and used as the key for the dictionary, the value is the array of readings.
// If the key already exists within the dictionary, the reading is pushed to the array. If not, a new key-value pair is created.
const groupReadingsByDate = (
  readings: Reading[],
): Record<string, Reading[]> => {
  const groupedReadings: Record<string, Reading[]> = {};
  readings.forEach((aReading) => {
    const key = aReading.recordedAt.slice(0, 10);
    if (key in groupedReadings) {
      groupedReadings[key].push(aReading);
    } else {
      groupedReadings[key] = [aReading];
    }
  });
  return groupedReadings;
};

// Returns a display heading corresponding to the date the reading was taken.
// Returns "Today" or "Yesterday" for the current and previous day, otherwise returns the date in a long format (e.g. "10 September 2026").
const getDateHeading = (date: string) => {
  const dateToday = new Date();

  const dateYesterday = new Date();
  dateYesterday.setDate(dateYesterday.getDate() - 1);

  if (date === formatDate(dateToday)) return "Today";
  if (date === formatDate(dateYesterday)) return "Yesterday";
  return formatLongDate(date);
};

export default function ReadingsList({ readings }: ReadingListProps) {
  const { thresholds } = useSettings();
  const { refreshReadings } = useReadings();
  const [openReadingId, setOpenReadingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Delete reading",
      "Are you sure you want to delete this reading?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteReading(id);
            await refreshReadings();
            setOpenReadingId(null);
          },
        },
      ],
    );
  };

  const grouped = groupReadingsByDate(readings);
  return (
    <View>
      {Object.keys(grouped).map((date) => (
        <View key={date}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionDate}>{getDateHeading(date)}</Text>
            <View style={styles.sectionLine} />
          </View>
          {grouped[date].map((aReading) => {
            const aThreshold = thresholds.find(
              (threshold) => threshold.thresholdType === aReading.type,
            );
            const readingThreshold = {
              lowValue: aThreshold?.lowValue ?? 0,
              highValue: aThreshold?.highValue ?? 0,
            };
            const colour = handleColourDisplay(
              aReading.glucoseReading,
              readingThreshold,
            );
            return (
              <View key={aReading.id}>
                <Pressable
                  style={[
                    styles.readingItem,
                    openReadingId === aReading.id && styles.readingItemSelected,
                  ]}
                  onPress={() => {
                    setOpenReadingId(
                      openReadingId === aReading.id ? null : aReading.id,
                    );
                  }}
                >
                  <Text style={styles.time}>
                    {aReading.recordedAt.slice(11, 16)}
                  </Text>
                  <GlucoseBar
                    glucoseReading={aReading.glucoseReading}
                    thresholdType={readingThreshold}
                    barColour={handleColourDisplay(
                      aReading.glucoseReading,
                      readingThreshold,
                    )}
                  />
                  <Text style={[styles.glucoseReading, { color: colour }]}>
                    {aReading.glucoseReading}
                  </Text>
                  <Text style={styles.type}>{aReading.type}</Text>
                  <Octicons
                    name={
                      openReadingId === aReading.id
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={20}
                    color="white"
                  />
                </Pressable>
                {openReadingId === aReading.id && (
                  <View style={styles.detailsPanel}>
                    <DetailsRow
                      label="Glucose reading"
                      value={String(aReading.glucoseReading)}
                      showDivider={true}
                    />
                    <DetailsRow
                      label="Context type"
                      value={String(aReading.type)}
                      showDivider={true}
                    />
                    <DetailsRow
                      label="Threshold"
                      value={
                        <View style={styles.thresholdBar}>
                          <Text style={styles.thresholdValue}>
                            {readingThreshold.lowValue}
                          </Text>
                          <GlucoseBar
                            glucoseReading={aReading.glucoseReading}
                            thresholdType={readingThreshold}
                            barColour={colour}
                          />
                          <Text style={styles.thresholdValue}>
                            {readingThreshold.highValue}
                          </Text>
                        </View>
                      }
                      showDivider={true}
                    />
                    {aReading.note && (
                      <DetailsRow
                        label="Note"
                        value={aReading.note}
                        showDivider={true}
                      />
                    )}
                    <DetailsRow
                      label="Time recorded"
                      value={String(aReading.recordedAt.slice(11, 16))}
                      showDivider={false}
                    />
                    <View style={styles.buttonsRow}>
                      <Pressable
                        style={styles.editButton}
                        onPress={() =>
                          router.push({
                            pathname: "/add_modal",
                            params: { readingId: String(aReading.id) },
                          })
                        }
                      >
                        <Octicons name="pencil" size={20} color="#3b9eff" />
                        <Text style={styles.editButtonText}>Edit reading</Text>
                      </Pressable>
                      <Pressable
                        style={styles.deleteButton}
                        onPress={() => handleDelete(aReading.id)}
                      >
                        <Entypo name="cross" size={24} color="#ff5c5c" />
                        <Text style={styles.deleteButtonText}>
                          Delete reading
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
  readingItem: {
    flexDirection: "row",
    padding: 18,
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "#17191F",
    borderRadius: 16,
  },
  readingItemSelected: {
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: "#42454D",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 0,
  },
  time: {
    color: "#ffffff",
    width: 70,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "700",
  },
  glucoseReading: {
    marginHorizontal: 10,
    color: "#ffffff",
    width: 50,
    fontSize: 20,
    fontWeight: 700,
    textAlign: "center",
  },
  displayBar: {
    backgroundColor: "#ffffff",
    flex: 1,
    height: 10,
    marginHorizontal: 10,
  },
  thresholdBar: {
    flex: 1,
    maxWidth: 180,
    flexDirection: "row",
    alignItems: "center",
  },
  thresholdValue: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
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
