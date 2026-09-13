import { useSettings } from "@/context/SettingsContext";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

export default function NameCard() {
  const { user, updateUser } = useSettings();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [profilePicture, setProfilePicture] = useState<string | null>(
    user?.profilePicture ?? null,
  );
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);

  // Generates the initials from the first and last name, or returns "U" (for "User") if neither are set.
  // Used to display the initials in the avatar if no profile picture is selected.
  const getInitials = (firstName: string | null, lastName: string | null) => {
    const firstInitial = firstName?.trim().charAt(0) ?? "";
    const lastInitial = lastName?.trim().charAt(0) ?? "";
    const initials = firstInitial + lastInitial;
    return initials ? initials.toUpperCase() : "U";
  };

  // Opens the image library, and stores the selected image to the User record in the database.
  const pickProfilePicture = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required to set a profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];
    if (!asset.base64) {
      Alert.alert(
        "Something went wrong",
        "That image could not be read. Please try again.",
      );
      return;
    }
    setProfilePicture(`data:image/jpeg;base64,${asset.base64}`);
    setIsUpdatingPhoto(true);
    try {
      await updateUser(firstName, lastName, profilePicture);
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  // Removes the profile picture from the User record in the database.
  const removeProfilePicture = async () => {
    setIsUpdatingPhoto(true);
    setProfilePicture(null);
    try {
      await updateUser(firstName, lastName, profilePicture);
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  // Allows for a new picture to be selected when the avatar is tapped. If one is already set, the existing picture can either be changed or removed.
  const handleAvatarPress = () => {
    if (isUpdatingPhoto) {
      return;
    }

    if (!profilePicture) {
      pickProfilePicture();
      return;
    }

    Alert.alert(
      "Profile picture",
      "Would you like to change or remove your profile picture?",
      [
        { text: "Change picture", onPress: pickProfilePicture },
        {
          text: "Remove picture",
          style: "destructive",
          onPress: removeProfilePicture,
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  // Clears the first name from the input field, and updates the User record.
  const clearFirstName = () => {
    setFirstName("");
    updateUser(firstName, lastName, user?.profilePicture ?? null);
  };

  // Clears the last name from the input field, and updates the User record.
  const clearLastName = () => {
    setLastName("");
    updateUser(firstName, lastName, user?.profilePicture ?? null);
  };

  return (
    <View style={styles.nameWrapper}>
      <View style={styles.avatarWrapper}>
        <Pressable style={styles.avatar} onPress={handleAvatarPress}>
          {profilePicture ? (
            <Image
              source={{ uri: profilePicture }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.avatarText}>
              {getInitials(firstName, lastName)}
            </Text>
          )}
          <View style={styles.avatarBadge}>
            {isUpdatingPhoto ? (
              <ActivityIndicator size="small" color="#0a0c0f" />
            ) : (
              <Ionicons name="camera" size={16} color="#0a0c0f" />
            )}
          </View>
        </Pressable>
      </View>
      <View style={styles.preview}>
        <Text style={styles.previewText}>
          {[firstName.trim(), lastName.trim()].filter(Boolean).join(" ") ||
            "User"}
        </Text>
      </View>
      <View style={styles.inputsWrapper}>
        <View style={styles.inputRow}>
          <Octicons name="person" size={22} color="white" />
          <TextInput
            style={styles.input}
            placeholder="First name (Optional)"
            placeholderTextColor={"#4f4f4f"}
            value={firstName}
            onChangeText={setFirstName}
            onBlur={() =>
              updateUser(firstName, lastName, user?.profilePicture ?? null)
            }
          />
          {firstName && (
            <Pressable onPress={clearFirstName}>
              <Entypo name="circle-with-cross" size={20} color="white" />
            </Pressable>
          )}
        </View>
        <View style={styles.inputRow}>
          <Octicons name="person" size={22} color="white" />
          <TextInput
            style={styles.input}
            placeholder="Last name (Optional)"
            placeholderTextColor={"#4f4f4f"}
            value={lastName}
            onChangeText={setLastName}
            onBlur={() =>
              updateUser(firstName, lastName, user?.profilePicture ?? null)
            }
          />
          {lastName && (
            <Pressable onPress={clearLastName}>
              <Entypo name="circle-with-cross" size={20} color="white" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "#2E4A24",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  avatarText: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#6CFF6C",
  },
  avatarBadge: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0fe500",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#17191F",
  },
  preview: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  previewText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
  },
  inputsWrapper: {
    gap: 12,
  },
  nameWrapper: {
    marginHorizontal: 20,
    backgroundColor: "#17191F",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#42454D",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    backgroundColor: "#0a0c0f",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 18,
  },
});
