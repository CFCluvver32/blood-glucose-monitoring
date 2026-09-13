import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";
import CustomTopTabBar from "../navigation/CustomTopTabBar";
import ExerciseHistoryTab from "./ExerciseHistoryTab";
import FoodHistoryTab from "./FoodHistoryTab";
import GlucoseHistoryTab from "./GlucoseHistoryTab";
import MedicationHistoryTab from "./MedicationHistoryTab";

const Tabs = createMaterialTopTabNavigator();

export default function HistoryTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        sceneStyle: { backgroundColor: "#0a0c0f" },
      }}
      tabBar={(props) => <CustomTopTabBar {...props} />}
    >
      <Tabs.Screen name="Glucose" component={GlucoseHistoryTab} />
      <Tabs.Screen name="Food" component={FoodHistoryTab} />
      <Tabs.Screen name="Exercise" component={ExerciseHistoryTab} />
      <Tabs.Screen name="Medication" component={MedicationHistoryTab} />
    </Tabs.Navigator>
  );
}
