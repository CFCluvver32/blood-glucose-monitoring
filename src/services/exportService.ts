import {
  Exercise,
  getAllExercises,
  getAllMeals,
  getAllMedication,
  getAllReadings,
  getUser,
  Meal,
  Medication,
  Reading,
} from "@/db/database";
import { formatDate, formatDateTime } from "@/utils/date";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import Papa from "papaparse";

// Defines the structure of the data that is assembled for export.
export interface DataExport {
  name: string | null;
  glucose: Reading[];
  meal: Meal[];
  exercise: Exercise[];
  medication: Medication[];
}

// Wraps export timestamp with data payload, used for JSON export.
export interface JSONExport {
  exportedAt: string;
  data: DataExport;
}

// Combines user's first name and last name into a display name. Returns null if neither are present.
function buildDisplayName(
  firstName: string | null,
  lastName: string | null,
): string | null {
  const displayName = [firstName, lastName].filter(Boolean).join(" ");
  return displayName || null;
}

// Fetches user, glucose, food, exercise and medication data from the database, and assembles it into a DataExport object.
async function getDataExport(): Promise<DataExport> {
  const [user, readings, meals, exercises, medications] = await Promise.all([
    getUser(),
    getAllReadings(),
    getAllMeals(),
    getAllExercises(),
    getAllMedication(),
  ]);
  return {
    name: buildDisplayName(user?.firstName ?? null, user?.lastName ?? null),
    glucose: readings,
    meal: meals,
    exercise: exercises,
    medication: medications,
  };
}

// Converts a DataExport object into a JSON string, wrapped with an exportedAt timestamp.
function convertToJSON(data: DataExport): string {
  const payload: JSONExport = {
    exportedAt: formatDateTime(),
    data,
  };
  return JSON.stringify(payload);
}

// Converts each part of the DataExport object into its own CSV string.
function convertToCSV(data: DataExport): Record<string, string> {
  return {
    glucose: Papa.unparse(data.glucose),
    meal: Papa.unparse(data.meal),
    exercise: Papa.unparse(data.exercise),
    medication: Papa.unparse(data.medication),
  };
}

// Writes a string to a file in the cache directory. Existing files with the same name are deleted first so re-exporting doesn't fail.
function writeExportFile(fileName: string, content: string): File {
  const file = new File(Paths.cache, fileName);
  if (file.exists) {
    file.delete();
  }
  file.create();
  file.write(content);
  return file;
}

// Assembles the export data and write it to the cache directory as a JSON file.
async function writeJSONExport(): Promise<File> {
  const dateString = formatDate(new Date());
  const data = await getDataExport();
  const content = convertToJSON(data);
  return writeExportFile(`health-data-export-${dateString}.json`, content);
}

// Assembles the export data and writes a CSV file per domain to the cache directory.
async function writeCSVExport(): Promise<Record<string, File>> {
  const dateString = formatDate(new Date());
  const data = await getDataExport();
  const content = convertToCSV(data);

  const csvFiles: Record<string, File> = {};

  for (const [key, value] of Object.entries(content)) {
    csvFiles[key] = writeExportFile(`${key}-export-${dateString}.csv`, value);
  }
  return csvFiles;
}

async function shareFile(file: File): Promise<void> {
  await Sharing.shareAsync(file.uri);
}

export async function shareJSONExport(): Promise<void> {
  // Checks if the API can be used in the application.
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("Sharing is not available on this device");
  }
  const file = await writeJSONExport();
  await shareFile(file);
}

export async function shareCSVExport(): Promise<void> {
  // Checks if the API can be used in the application.
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("Sharing is not available on this device");
  }
  const files = await writeCSVExport();
  for (const [key, value] of Object.entries(files)) {
    try {
      await shareFile(value);
    } catch (error) {
      console.error(`Failed to share ${key} export`, error);
    }
  }
}
