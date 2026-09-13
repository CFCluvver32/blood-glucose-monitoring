import { useReadings } from "@/context/ReadingsContext";
import { insertMeal, MealType, updateMeal } from "@/db/database";
import { formatDateTime } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MealTypeSelector from "../MealTypeSelector";

export default function FoodTab() {
  const { meals, refreshMeals } = useReadings();
  const { mealId } = useLocalSearchParams<{ mealId?: string }>();

  // Searches the logged meals to find the Meal object with a matching id, if mealId is populated. Otherwise, returns undefined.
  // Used to edit a meal.
  const existingMeal = mealId
    ? meals.find((meal) => meal.id === Number(mealId))
    : undefined;

  const [meal, setMeal] = useState<string>(existingMeal?.mealName ?? "");

  const [mealType, setMealType] = useState<MealType | "">(
    existingMeal?.mealType ?? "",
  );

  const [note, setNote] = useState<string>(existingMeal?.note ?? "");

  const [photo, setPhoto] = useState<string | null>(existingMeal?.photo ?? "");

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required to add a meal photo.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handlePhotoClear = () => {
    setPhoto(null);
  };

  const clearMeal = () => {
    setMeal("");
  };

  const clearNote = () => {
    setNote("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subheading}>MEAL NAME</Text>
      <View style={styles.mealInputWrapper}>
        <TextInput
          style={styles.textInput}
          value={meal}
          multiline={true}
          placeholder="e.g. Grilled chicken salad"
          placeholderTextColor={"#4f4f4f"}
          onChangeText={setMeal}
        />
        {meal && (
          <Pressable style={styles.clearButton} onPress={clearMeal}>
            <Entypo name="circle-with-cross" size={20} color="white" />
          </Pressable>
        )}
      </View>

      <View style={styles.mealType}>
        <Text style={styles.subheading}>MEAL TYPE</Text>
        <MealTypeSelector value={mealType} onChange={setMealType} />
      </View>
      <Text style={styles.subheading}>NOTE (OPTIONAL)</Text>
      <View style={styles.noteInputWrapper}>
        <TextInput
          style={styles.note}
          value={note}
          multiline={true}
          placeholder="Add a note..."
          placeholderTextColor={"#4f4f4f"}
          onChangeText={setNote}
        />
        {note && (
          <Pressable style={styles.clearButton} onPress={clearNote}>
            <Entypo name="circle-with-cross" size={20} color="white" />
          </Pressable>
        )}
      </View>

      <View style={styles.photoWrapper}>
        <Text style={styles.subheading}>PHOTO (OPTIONAL)</Text>
        <Pressable style={styles.photoBox} onPress={pickImage}>
          {photo ? (
            <>
              <Image source={{ uri: photo }} style={styles.photoPreview} />
              <Pressable
                style={styles.clearPhotoButton}
                onPress={handlePhotoClear}
              >
                <Ionicons name="close-circle" size={20} color={"#ffffff"} />
              </Pressable>
            </>
          ) : (
            <>
              <Ionicons name={"image-outline"} size={40} color={"#ffffff"} />
              <Text style={styles.photoPlaceholderText}>
                Tap to add a meal photo
              </Text>
            </>
          )}
        </Pressable>
      </View>
      <Pressable
        style={styles.submitWrapper}
        onPress={async () => {
          if (!meal && !mealType) {
            Alert.alert(
              "Additional information required",
              "You must supply a meal name and a meal type to log a meal.",
            );
            return;
          } else if (!meal) {
            Alert.alert(
              "Meal name required",
              "You must supply a meal name to log a meal.",
            );
            return;
          } else if (!mealType) {
            Alert.alert(
              "Meal type required",
              "You must select a meal type to log a meal.",
            );
            return;
          }
          if (existingMeal) {
            await updateMeal(
              existingMeal.id,
              meal,
              mealType,
              note,
              photo ?? "",
            );
          } else {
            await insertMeal(
              null,
              meal,
              mealType,
              note,
              photo,
              formatDateTime(),
            );
          }
          await refreshMeals();
          router.dismiss();
        }}
      >
        <LinearGradient
          colors={["#0fe500", "#267d2a", "#003705"]}
          style={styles.submitButton}
        >
          <Text style={styles.submitText}>
            {existingMeal ? "UPDATE" : "SUBMIT"}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mealInputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  subheading: {
    color: "#808080",
    fontSize: 14,
    marginBottom: 8,
  },
  textInput: {
    fontSize: 18,
    color: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#42454D",
    backgroundColor: "#282C36",
    borderRadius: 10,
    padding: 20,
    height: 64,
    textAlignVertical: "top",
  },
  clearButton: {
    position: "absolute",
    right: 16,
    justifyContent: "center",
  },
  mealType: {
    marginTop: 20,
  },
  noteInputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  note: {
    fontSize: 18,
    color: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#42454D",
    backgroundColor: "#282C36",
    borderRadius: 10,
    padding: 20,
    height: 64,
    textAlignVertical: "top",
  },
  photoWrapper: {
    marginTop: 20,
  },
  photoBox: {
    borderWidth: 2,
    backgroundColor: "#0a0c0f",
    borderColor: "#42454D",
    borderStyle: "dashed",
    borderRadius: 16,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  photoPreview: {
    height: "100%",
    width: "100%",
  },
  clearPhotoButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  photoPlaceholderText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  submitWrapper: {
    marginTop: "auto",
  },
  submitButton: {
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00ff7f",
  },
  submitText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    padding: 16,
  },
});
