import {
  Exercise,
  Meal,
  Medication,
  Reading,
  getAllExercises,
  getAllMeals,
  getAllMedication,
  getAllReadings,
} from "@/db/database";
import { createContext, useContext, useEffect, useState } from "react";

interface ReadingsContextType {
  readings: Reading[];
  loading: boolean;
  error: string | null;
  refreshReadings: () => Promise<void>;
  meals: Meal[];
  mealsLoading: boolean;
  mealsError: string | null;
  refreshMeals: () => Promise<void>;
  exercises: Exercise[];
  exercisesLoading: boolean;
  exercisesError: string | null;
  refreshExercises: () => Promise<void>;
  medications: Medication[];
  medicationsLoading: boolean;
  medicationsError: string | null;
  refreshMedications: () => Promise<void>;
}

// Creates the Context that carries data around the application. Starts off as undefined until Provider fills it.
const ReadingsContext = createContext<ReadingsContextType | undefined>(
  undefined,
);

// Provides glucose readings, loading and error states to the rest of the application, and a function to refresh the readings from the database.
export function ReadingsProvider({ children }: { children: React.ReactNode }) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealsLoading, setMealsLoading] = useState(true);
  const [mealsError, setMealsError] = useState<string | null>(null);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exercisesLoading, setExercisesLoading] = useState(true);
  const [exercisesError, setExercisesError] = useState<string | null>(null);

  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationsLoading, setMedicationsLoading] = useState(true);
  const [medicationsError, setMedicationsError] = useState<string | null>(null);

  async function refreshReadings() {
    try {
      const result = await getAllReadings();
      setReadings(result);
      setError(null); // clears any old errors, in case a previous attempt failed
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function refreshMeals() {
    try {
      const result = await getAllMeals();
      setMeals(result);
      setMealsError(null);
    } catch (error) {
      setMealsError(error instanceof Error ? error.message : String(error));
      console.error(error);
    } finally {
      setMealsLoading(false);
    }
  }

  async function refreshExercises() {
    try {
      const result = await getAllExercises();
      setExercises(result);
      setExercisesError(null);
    } catch (error) {
      setExercisesError(error instanceof Error ? error.message : String(error));
      console.error(error);
    } finally {
      setExercisesLoading(false);
    }
  }

  async function refreshMedications() {
    try {
      const result = await getAllMedication();
      setMedications(result);
      setMedicationsError(null);
    } catch (error) {
      setMedicationsError(
        error instanceof Error ? error.message : String(error),
      );
      console.error(error);
    } finally {
      setMedicationsLoading(false);
    }
  }

  useEffect(() => {
    refreshReadings();
    refreshMeals();
    refreshExercises();
    refreshMedications();
  }, []);

  return (
    <ReadingsContext.Provider
      value={{
        readings,
        loading,
        error,
        refreshReadings,
        meals,
        mealsLoading,
        mealsError,
        refreshMeals,
        exercises,
        exercisesLoading,
        exercisesError,
        refreshExercises,
        medications,
        medicationsLoading,
        medicationsError,
        refreshMedications,
      }}
    >
      {children}
    </ReadingsContext.Provider>
  );
}

// Provides access to ReadingsContext to any component that calls it. Throws an error if the component is not wrapped in ReadingsProvider.
export function useReadings() {
  const context = useContext(ReadingsContext);
  if (!context) {
    throw new Error(
      "No ReadingsProvider was found above this component in the tree",
    );
  }
  return context;
}
