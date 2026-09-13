import { useLocalSearchParams } from "expo-router";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";
import CustomTopTabBar from "../navigation/CustomTopTabBar";
import ExerciseTab from "./ExerciseTab";
import FoodTab from "./FoodTab";
import GlucoseTab from "./GlucoseTab";
import MedicationTab from "./MedicationTab";

const Tabs = createMaterialTopTabNavigator();

export default function LogReadingTabs() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();

  return (
    <Tabs.Navigator
      initialRouteName={tab ?? "Glucose"}
      screenOptions={{ sceneStyle: { backgroundColor: "#17191F" } }}
      tabBar={(props) => <CustomTopTabBar {...props} />}
    >
      <Tabs.Screen name="Glucose" component={GlucoseTab} />
      <Tabs.Screen name="Food" component={FoodTab} />
      <Tabs.Screen name="Exercise" component={ExerciseTab} />
      <Tabs.Screen name="Medication" component={MedicationTab} />
    </Tabs.Navigator>
  );
}
