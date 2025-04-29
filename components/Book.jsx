import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { Link } from "expo-router";
import { Text, View, Image, TouchableOpacity } from "react-native";
import BookmarkButton from "./BookmarkButton";

export default function Book({ image, name, authors }) {
  return (
    <View style={{ display: "flex" }}>
      <Image
        source={{
          uri: image,
        }}
        style={{ width: 200, height: 300, borderRadius: 8 }}
      />
      <View style={{ width: 200 }}>
        <ThemedText
          style={{ fontWeight: "bold", lineHeight: 18, marginTop: 5 }}
        >
          {name}
        </ThemedText>
        <ThemedText style={{ fontSize: 14, lineHeight: 18 }}>
          by {authors[0]} {authors.length > 1 ? `(+${authors.length - 1})` : ``}
        </ThemedText>
        <BookmarkButton />
      </View>
    </View>
  );
}
