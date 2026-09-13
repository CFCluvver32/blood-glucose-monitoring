import {
  Threshold,
  ThresholdType,
  User,
  getAllThresholds,
  getUser,
  updateThreshold as thresholdUpdate,
  updateUser as userUpdate,
} from "@/db/database";
import { createContext, useContext, useEffect, useState } from "react";

interface SettingsContextType {
  thresholds: Threshold[];
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  updateUser: (
    firstName: string | null,
    lastName: string | null,
    profilePicture: string | null,
  ) => Promise<void>;
  updateThreshold: (
    thresholdType: ThresholdType,
    lowValue: number,
    highValue: number,
  ) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshSettings() {
    try {
      const thresholdsResult = await getAllThresholds();
      setThresholds(thresholdsResult);
      const userResult = await getUser();
      setUser(userResult);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshSettings();
  }, []);

  async function updateUser(
    firstName: string | null,
    lastName: string | null,
    profilePicture: string | null,
  ) {
    try {
      await userUpdate(firstName, lastName, profilePicture);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
      console.error(error);
    } finally {
      await refreshSettings();
    }
  }

  async function updateThreshold(
    thresholdType: ThresholdType,
    lowValue: number,
    highValue: number,
  ) {
    try {
      await thresholdUpdate(thresholdType, lowValue, highValue);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
      console.error(error);
    } finally {
      await refreshSettings();
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        thresholds,
        user,
        loading,
        error,
        refreshSettings,
        updateUser,
        updateThreshold,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      "No SettingsProvider was found above this component in the tree",
    );
  }
  return context;
}
