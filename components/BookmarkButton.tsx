import { Platform, Pressable } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedText } from "./ThemedText";

export default function BookmarkButton({ thisBookId }: { thisBookId: string }) {
  const query = useLocalSearchParams();
  const [book_id, setBookId] = useState(query.book_id ? query.book_id : "");

  return (
    <Pressable
      onPress={() => {
        if (thisBookId) {
          setBookId(thisBookId);
          setTimeout(
            () => router.navigate(`../../../logBookmark?id=${thisBookId}`),
            100
          );
        }
      }}
      style={({ pressed }: { pressed: boolean }) => ({
        backgroundColor: "#79AB57",
        width: "100%",
        height: 32,
        marginTop: 5,
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <ThemedText
        type="bold"
        style={{
          color: "#fff",
          fontSize: 16,
          textAlign: "center",
          marginTop: Platform.OS === "web" ? 0 : 2,
        }}
      >
        Bookmark!
      </ThemedText>
    </Pressable>
  );
}
