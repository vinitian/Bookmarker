import { Text, Platform, TouchableOpacity } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedText } from "./ThemedText";

export default function BookmarkButton({ color = "#79AB57", thisBookId }) {
 const query = useLocalSearchParams();
  const [book_id, setBookId] = useState(query.book_id ? query.book_id : "");
  
  return (
    <TouchableOpacity
      onPress={() => {
        if (thisBookId) {
          setBookId(thisBookId);
          setTimeout(() => router.navigate(`../../../logBookmark?id=${thisBookId}`), 100);
        }
      }}
      style={{
        backgroundColor: color,
        width: "full",
        height: 32,
        marginTop: 5,
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
      }}
    >
      <ThemedText
      type="bold"
        style={{
          color: "#fff",
          fontSize: 16,
          textAlign: "center",
          marginTop: Platform.OS === "web" ? 0 : -4,
        }}
      >
        Bookmark!
      </ThemedText>
    </TouchableOpacity>
  );
}
