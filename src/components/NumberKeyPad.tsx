import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface NumberKeyPadProps {
  value: string;
  onChange: (number: string) => void;
}

export default function NumberKeyPad({ value, onChange }: NumberKeyPadProps) {
  const handleKeyPress = (key: string) => {
    // Deletes last digit
    if (key === "Del") {
      onChange(value.slice(0, -1));
      // Prevents a second decimal point
    } else if (key === "." && value.includes(".")) {
      return;
      // Prevents more than 4 numbers being entered
    } else if (value.length >= 4) {
      return;
    } else {
      onChange(value + key);
    }
  };

  const numbers = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ".",
    "0",
    "Del",
  ];

  return (
    <View style={styles.keypad}>
      {numbers.map((number) => (
        <Pressable
          key={number}
          style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
          onPress={() => {
            handleKeyPress(number);
          }}
        >
          {number === "Del" ? (
            <Feather name="delete" size={30} color="white" />
          ) : (
            <Text style={styles.keyText}>{number}</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },

  key: {
    width: "30%",
    aspectRatio: 1.6,
    backgroundColor: "#282C36",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#42454D",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  keyPressed: {
    backgroundColor: "#42454D",
  },
  keyText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "500",
    transform: [{ translateY: -10 }],
  },
});
