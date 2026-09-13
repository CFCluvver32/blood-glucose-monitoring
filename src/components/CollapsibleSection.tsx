import Octicons from "@expo/vector-icons/Octicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export default function CollapsibleSection({
  title,
  children,
  isOpen,
  onToggle,
}: CollapsibleSectionProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onToggle}>
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.sectionLine} />
          <Octicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="white"
          />
        </View>
      </Pressable>
      {isOpen && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0c0f",
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 24,
    marginBottom: 10,
  },
  title: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
    marginRight: 10,
  },
  sectionLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ffffff",
    marginRight: 10,
  },
  sectionContent: {
    marginBottom: 10,
  },
});
