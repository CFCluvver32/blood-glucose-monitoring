import { MaterialTopTabBarProps } from "expo-router/js-top-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function CustomTopTabBar({
  state,
  descriptors,
  navigation,
}: MaterialTopTabBarProps) {
  return (
    <View style={styles.tabRow}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;

        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={[styles.pill, isFocused && styles.pillActive]}
          >
            <Text style={[styles.pillText, isFocused && styles.pillTextActive]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginTop: 16,
    marginBottom: 16,
    gap: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#42454D",
    backgroundColor: "#0a0c0f",
  },
  pill: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  pillText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  pillActive: {
    backgroundColor: "#0fe500",
  },
  pillTextActive: {
    color: "#17191F",
  },
});
