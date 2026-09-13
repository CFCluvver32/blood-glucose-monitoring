import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

const DB_KEY_NAME = "glucose_database_key";

// Helper function to convert a Uint8Array (returned by Crypto.getRandomBytesAsync) to a hexadecimal string.
function bytesToHexString(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// Retrieves the database key from secure storage, or generates a new one if it doesn't exist.
export async function getDatabaseKey(): Promise<string> {
  let key = await SecureStore.getItemAsync(DB_KEY_NAME);
  if (!key) {
    const randomBytes = await Crypto.getRandomBytesAsync(32);
    key = bytesToHexString(randomBytes);
    await SecureStore.setItemAsync(DB_KEY_NAME, key);
  }
  return key;
}
