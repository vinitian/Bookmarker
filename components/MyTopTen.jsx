import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { Link } from "expo-router";
import { Text, View, Image, TouchableOpacity } from "react-native";
import Book from "./Book";

export default function MyTopTen() {
  const [fontsLoaded] = useFonts({
    Trirong_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <View>
      <ThemedText
        style={{
          fontFamily: "Trirong_700Bold",
          fontSize: 24,
          paddingVertical: 15,
          paddingLeft: 15,
        }}
      >
        My Top Ten
      </ThemedText>
      <Book />
    </View>
  );
}
