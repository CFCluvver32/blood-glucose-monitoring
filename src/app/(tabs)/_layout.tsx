import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

// Renders a circular button and opens the logging modal via onPress
function AddButton({ onPress }: { onPress?: () => void }) {
  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.button} onPress={onPress}>
        <Ionicons name="add" size={40} color="#ffffff" />
      </Pressable>
    </View>
  );
}

// Defines the layout and look of the tab navigation, and it includes a custom "Add" button in the centre of the bar.
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#808080",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#17191F",
          borderTopWidth: 1,
          borderTopColor: "#a1a1a1",
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontFamily: "arial",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "",
          tabBarIcon: () => null,
          tabBarButton: (props) => (
            <AddButton onPress={() => router.push("/add_modal")} />
          ),
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: "Trends",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="debug"
        options={{
          title: "Debug",
        }}
      />
    </Tabs>
  );
}

// Defines the styles for the custom "Add" button and its wrapper.
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#1a9601",
    backgroundColor: "#34C52D",
    bottom: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#34C52D",
    shadowOpacity: 0.6,
    shadowRadius: 7,
    elevation: 5,
  },
});
