import * as SQLite from "expo-sqlite";
import { getDatabaseKey } from "./security/keyManager";

// Single user row automatically created with id = 1
const CURRENT_USER_ID = 1;

// --- Interface for each Entity ---

// Defines the structure of a Reading object
export interface Reading {
  id: number;
  userId: number;
  glucoseReading: number;
  recordedAt: string;
  type: string;
  note: string | null;
  isAboveThreshold: boolean;
  isBelowThreshold: boolean;
}

// Defines the structures of a User object
export interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  profilePicture: string | null;
}

interface DefaultThresholds {
  thresholdType: ThresholdType;
  lowValue: number;
  highValue: number;
}

// Specifies the values that ThresholdType accepts
export type ThresholdType = "Pre-meal" | "Post-meal" | "Exercise" | "Fasting";

// Defines the structures of a Threshold object
export interface Threshold {
  id: number;
  userId: number;
  thresholdType: ThresholdType;
  lowValue: number;
  highValue: number;
}

// Specifies the values that MealType accepts
export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

// Defines the structures of a Meal object
export interface Meal {
  id: number;
  userId: number;
  readingId: number | null;
  mealName: string;
  mealType: MealType;
  note: string | null;
  photo: string | null;
  recordedAt: string;
}

export interface Exercise {
  id: number;
  userId: number;
  readingId: number | null;
  activityType: string;
  duration: number;
  intensity: string;
  note: string | null;
  recordedAt: string;
}

export type UnitOfMeasure = "units" | "mg" | "mcg" | "mL";

export interface Medication {
  id: number;
  userId: number;
  readingId: number | null;
  medicationName: string;
  dose: number;
  unitOfMeasure: UnitOfMeasure;
  timeTaken: string;
  note: string | null;
}

export let db: SQLite.SQLiteDatabase;

// Initialises the database by opening a connection, setting the encryption key, enabling foreign keys, and creating the tables (if they don't already exist).
export async function initialiseDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync("glucose.db");
  const encryptionKey = await getDatabaseKey();

  await db.execAsync(`PRAGMA key = '${encryptionKey}'`);
  await db.execAsync(`PRAGMA foreign_keys = ON;`);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT, 
      lastName TEXT,
      profilePicture TEXT
      );

    CREATE TABLE IF NOT EXISTS BloodGlucoseReadings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      glucoseReading REAL NOT NULL,
      type TEXT NOT NULL,
      note TEXT,
      isAboveThreshold BOOLEAN NOT NULL DEFAULT 0,
      isBelowThreshold BOOLEAN NOT NULL DEFAULT 0,
      recordedAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Thresholds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      thresholdType TEXT NOT NULL,
      lowValue REAL NOT NULL,
      highValue REAL NOT NULL,
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      readingId INTEGER,  
      mealName TEXT NOT NULL,
      mealType TEXT NOT NULL,
      note TEXT,
      photo TEXT,
      recordedAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
      FOREIGN KEY (readingId) REFERENCES BloodGlucoseReadings(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Exercise (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      readingId INTEGER,
      activityType TEXT NOT NULL,
      duration INTEGER NOT NULL,
      intensity TEXT NOT NULL,
      note TEXT,
      recordedAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
      FOREIGN KEY (readingId) REFERENCES BloodGlucoseReadings(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Medication (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      readingId INTEGER,
      medicationName TEXT NOT NULL,
      dose REAL NOT NULL,
      unitOfMeasure TEXT NOT NULL,
      timeTaken TEXT NOT NULL,
      note TEXT, 
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
      FOREIGN KEY (readingId) REFERENCES BloodGlucoseReadings(id) ON DELETE CASCADE
    );
  `);

  await checkUserExists();
  await checkThresholdsExist();
}

// --- User operations ---

// Checks if a user exists in the User table.
// If not, a new user is created with an id of 1 and null values for firstName, lastName, and profilePicture.
async function checkUserExists(): Promise<void> {
  const userExists = await db.getFirstAsync<{ id: number }>(
    `SELECT id FROM User WHERE id = ?`,
    [CURRENT_USER_ID],
  );

  if (!userExists) {
    await db.runAsync(
      `INSERT INTO User (id, firstName, lastName, profilePicture) VALUES (?, ?, ?, ?)`,
      [CURRENT_USER_ID, null, null, null],
    );
  }
}

// Updates the the user row in the User table with the provided firstName, lastName, and profilePicture.
export async function updateUser(
  firstName: string | null,
  lastName: string | null,
  profilePicture: string | null,
): Promise<void> {
  await db.runAsync(
    `UPDATE User SET firstName = ?, lastName = ?, profilePicture = ? WHERE id = ?`,
    [firstName, lastName, profilePicture, CURRENT_USER_ID],
  );
}

// Retrieves the user row from the User table.
export async function getUser(): Promise<User | null> {
  const result = await db.getFirstAsync<User>(
    `SELECT id, firstName, lastName, profilePicture FROM User WHERE id = ?`,
    [CURRENT_USER_ID],
  );
  return result ?? null;
}

// --- BloodGlucoseReadings operations ---

// Flags whether a reading falls outside a normal threshold for a given glucose reading and threshold type.
async function calculateThresholdFlags(
  glucoseReading: number,
  thresholdType: ThresholdType,
): Promise<{ isAboveThreshold: boolean; isBelowThreshold: boolean }> {
  const threshold = await db.getFirstAsync<{
    lowValue: number;
    highValue: number;
  }>(
    `SELECT lowValue, highValue FROM Thresholds WHERE userId = ? AND thresholdType = ?`,
    [CURRENT_USER_ID, thresholdType],
  );

  if (!threshold) {
    return { isAboveThreshold: false, isBelowThreshold: false };
  }

  return {
    isAboveThreshold: glucoseReading > threshold.highValue,
    isBelowThreshold: glucoseReading < threshold.lowValue,
  };
}

// Inserts a new blood glucose reading into the BloodGlucoseReadings table.
export async function insertReading(
  glucoseReading: number,
  recordedAt: string,
  type: ThresholdType,
  note: string | null,
): Promise<number> {
  const { isAboveThreshold, isBelowThreshold } = await calculateThresholdFlags(
    glucoseReading,
    type,
  );
  const result = await db.runAsync(
    `INSERT INTO BloodGlucoseReadings(userId, glucoseReading, type, note, isAboveThreshold, isBelowThreshold, recordedAt) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [
      CURRENT_USER_ID,
      glucoseReading,
      type,
      note,
      isAboveThreshold ? 1 : 0,
      isBelowThreshold ? 1 : 0,
      recordedAt,
    ],
  );
  return result.lastInsertRowId;
}

// Returns an array of all stored blood glucose readings from the BloodGlucoseReadings table, ordered by most recent first
export async function getAllReadings(): Promise<Reading[]> {
  const result = await db.getAllAsync<Reading>(
    `SELECT id, glucoseReading, type, note, isAboveThreshold, isBelowThreshold, recordedAt
     FROM BloodGlucoseReadings 
     ORDER BY recordedAt DESC;`,
  );
  return result;
}

// Updates a blood glucose reading stored in the BloodGlucoseReadings table
export async function updateReading(
  id: number,
  glucoseReading: number,
  type: ThresholdType,
  note: string | null,
): Promise<void> {
  const { isAboveThreshold, isBelowThreshold } = await calculateThresholdFlags(
    glucoseReading,
    type,
  );
  await db.runAsync(
    `UPDATE BloodGlucoseReadings SET glucoseReading = ?, type = ?, note = ?, isAboveThreshold = ?, isBelowThreshold = ? WHERE id = ?`,
    [
      glucoseReading,
      type,
      note,
      isAboveThreshold ? 1 : 0,
      isBelowThreshold ? 1 : 0,
      id,
    ],
  );
}

// Deletes a blood glucose reading stored in the BloodGlucoseReadings table
export async function deleteReading(id: number): Promise<void> {
  await db.runAsync(`DELETE FROM BloodGlucoseReadings WHERE id = ?`, id);
}

// Returns the number of readings within a given date range (e.g. getReadingCountByDays(30) returns the number of readings within the last 30 days).
export async function getReadingCountByDays(
  numOfDays: number,
): Promise<number> {
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) AS count FROM BloodGlucoseReadings WHERE recordedAt >= date("now", "-${numOfDays} days")`,
  );
  return result?.count ?? 0;
}

// --- Thresholds operations ---

// Defines the default thresholds types and their respective values to be added when the application starts.
export const DEFAULT_THRESHOLDS: DefaultThresholds[] = [
  { thresholdType: "Pre-meal", lowValue: 4.0, highValue: 7.0 },
  { thresholdType: "Post-meal", lowValue: 5.0, highValue: 9.0 },
  { thresholdType: "Exercise", lowValue: 5.6, highValue: 12.0 },
  { thresholdType: "Fasting", lowValue: 5.0, highValue: 7.0 },
];

// Checks if default thresholds exist in the Thresholds table. If not, they are inserted.
async function checkThresholdsExist(): Promise<void> {
  for (const defaultThreshold of DEFAULT_THRESHOLDS) {
    const thresholdsExist = await getThreshold(defaultThreshold.thresholdType);

    if (!thresholdsExist) {
      await db.runAsync(
        `INSERT INTO Thresholds (userId, thresholdType, lowValue, highValue) VALUES (?, ?, ?, ?);`,
        [
          CURRENT_USER_ID,
          defaultThreshold.thresholdType,
          defaultThreshold.lowValue,
          defaultThreshold.highValue,
        ],
      );
    }
  }
}

// Returns the threshold values for a given threshold type (e.g. "Pre-meal", "Post-meal", "Exercise", "Fasting").
export async function getThreshold(
  thresholdType: ThresholdType,
): Promise<Threshold | null> {
  const result = await db.getFirstAsync<Threshold>(
    `SELECT id, userId, thresholdType, lowValue, highValue from Thresholds WHERE userId = ? AND thresholdType = ?`,
    [CURRENT_USER_ID, thresholdType],
  );
  return result ?? null;
}

// Retrieves all the threshold values from the Thresholds table.
export async function getAllThresholds(): Promise<Threshold[]> {
  const result = await db.getAllAsync<Threshold>(
    `SELECT id, userId, thresholdType, lowValue, highValue FROM Thresholds WHERE userId = ?`,
    [CURRENT_USER_ID],
  );
  return result;
}

// Updates a given threshold with the new low and high values.
export async function updateThreshold(
  thresholdType: ThresholdType,
  lowValue: number,
  highValue: number,
): Promise<void> {
  await db.runAsync(
    `UPDATE Thresholds SET lowValue = ?, highValue = ? WHERE userId = ? AND thresholdType = ?`,
    [lowValue, highValue, CURRENT_USER_ID, thresholdType],
  );
}

// --- Meal operations ---

// Inserts a new meal into the Meals table.
export async function insertMeal(
  readingId: number | null,
  mealName: string,
  mealType: MealType,
  note: string | null,
  photo: string | null,
  recordedAt: string,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO Meals (userId, readingId, mealName, mealType, note, photo, recordedAt) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [CURRENT_USER_ID, readingId, mealName, mealType, note, photo, recordedAt],
  );
}

// Retrieves all of the meals stored in the Meals table, ordered by the most recent first.
export async function getAllMeals(): Promise<Meal[]> {
  const result = await db.getAllAsync<Meal>(
    `SELECT id, userId, readingId, mealName, mealType, note, photo, recordedAt 
     FROM Meals WHERE userId = ?
     ORDER BY recordedAt DESC;`,
    [CURRENT_USER_ID],
  );
  return result;
}

// Updates a meal stored in the Meals table, given the meal's id and and the new mealName, mealType, note and photo values.
export async function updateMeal(
  id: number,
  mealName: string,
  mealType: MealType,
  note: string,
  photo: string,
): Promise<void> {
  await db.runAsync(
    `UPDATE Meals SET mealName = ?, mealType = ?, note = ?, photo = ? WHERE id = ?`,
    [mealName, mealType, note, photo, id],
  );
}

export async function updateMealReadingId(
  readingId: number,
  recordedAt: string,
): Promise<void> {
  await db.runAsync(
    `UPDATE Meals SET readingId = ? WHERE userId = ? AND readingId IS NULL AND recordedAt >= dateTime(?, "-60 minutes") AND recordedAt <= ?`,
    [readingId, CURRENT_USER_ID, recordedAt, recordedAt],
  );
}

// Deletes a meal from the Meals table, given the meal's id.
export async function deleteMeal(id: number): Promise<void> {
  await db.runAsync(`DELETE FROM Meals WHERE id = ?`, id);
}

// --- Exercise operations ---

// Inserts a new exercise into the Exercise table.
export async function insertExercise(
  readingId: number | null,
  activityType: string,
  duration: number,
  intensity: string,
  note: string | null,
  recordedAt: string,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO Exercise (userId, readingId, activityType, duration, intensity, note, recordedAt) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [
      CURRENT_USER_ID,
      readingId,
      activityType,
      duration,
      intensity,
      note,
      recordedAt,
    ],
  );
}

export async function getAllExercises(): Promise<Exercise[]> {
  const result = await db.getAllAsync<Exercise>(
    `SELECT id, userId, readingId, activityType, duration, intensity, note, recordedAt 
     FROM Exercise WHERE userId = ? 
     ORDER BY recordedAt DESC;`,
    [CURRENT_USER_ID],
  );
  return result;
}

export async function updateExercise(
  id: number,
  activityType: string,
  duration: number,
  intensity: string,
  note: string,
): Promise<void> {
  await db.runAsync(
    `UPDATE Exercise SET activityType = ?, duration = ?, intensity = ?, note = ? WHERE id = ?`,
    [activityType, duration, intensity, note, id],
  );
}

export async function updateExerciseReadingId(
  readingId: number,
  recordedAt: string,
): Promise<void> {
  await db.runAsync(
    `UPDATE Exercise SET readingId = ? WHERE userId = ? AND readingId IS NULL AND recordedAt >= dateTime(?, "-60 minutes") AND recordedAt <= ?`,
    [readingId, CURRENT_USER_ID, recordedAt, recordedAt],
  );
}

export async function deleteExercise(id: number): Promise<void> {
  await db.runAsync(`DELETE FROM Exercise WHERE id = ?`, id);
}

// --- Medication operations ---

export async function insertMedication(
  readingId: number | null,
  medicationName: string,
  dose: number,
  unitOfMeasure: UnitOfMeasure,
  timeTaken: string,
  note: string | null,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO Medication (userId, readingId, medicationName, dose, unitOfMeasure, timeTaken, note) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [
      CURRENT_USER_ID,
      readingId,
      medicationName,
      dose,
      unitOfMeasure,
      timeTaken,
      note,
    ],
  );
}

export async function getAllMedication(): Promise<Medication[]> {
  const result = await db.getAllAsync<Medication>(
    `SELECT id, userId, readingId, medicationName, dose, unitOfMeasure, timeTaken, note
     FROM Medication WHERE userId = ? 
     ORDER BY timeTaken DESC;`,
    [CURRENT_USER_ID],
  );
  return result;
}

export async function updateMedication(
  id: number,
  medicationName: string,
  dose: number,
  unitOfMeasure: UnitOfMeasure,
  timeTaken: string,
  note: string,
): Promise<void> {
  await db.runAsync(
    `UPDATE Medication SET medicationName = ?, dose = ?, unitOfMeasure = ?, timeTaken = ?, note = ? WHERE id = ?`,
    [medicationName, dose, unitOfMeasure, timeTaken, note, id],
  );
}

//
export async function updateMedicationReadingId(
  readingId: number,
  recordedAt: string,
): Promise<void> {
  await db.runAsync(
    `UPDATE Medication SET readingId = ? WHERE userId = ? AND readingId IS NULL AND timeTaken >= dateTime(?, "-60 minutes") AND timeTaken <= ?`,
    [readingId, CURRENT_USER_ID, recordedAt, recordedAt],
  );
}

export async function deleteMedication(id: number): Promise<void> {
  await db.runAsync(`DELETE FROM Medication WHERE id = ?`, id);
}

// --- Data reset operations ---

// Deletes all of the logged data - glucose, food, exercise, and medication - for the current user. User profile and threshold ranges are untouched.
export async function deleteAllData(): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.runAsync(`DELETE FROM BloodGlucoseReadings WHERE userId = ?`, [
      CURRENT_USER_ID,
    ]);
    await db.runAsync(`DELETE FROM Meals WHERE userId = ?`, [CURRENT_USER_ID]);
    await db.runAsync(`DELETE FROM Exercise WHERE userId = ?`, [
      CURRENT_USER_ID,
    ]);
    await db.runAsync(`DELETE FROM Medication WHERE userId = ?`, [
      CURRENT_USER_ID,
    ]);
  });
}
