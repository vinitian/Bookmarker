import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import { Text, View, Image } from "react-native";
import BookmarkButton from "./BookmarkButton";
import { useEffect, useState } from "react";
import fetchBook from "@/lib/fetchBook";

export default function Book({ bookId }) {
  const [bookData, setBookData] = useState(null);

  const handleBookmark = () => {
    // change context
  };

  useEffect(() => {
    if (bookId) {
      fetchBook({ book_id: bookId, setBookData: setBookData });
    }
  }, [bookId]);
  if (!bookData) return <Text>Loading...</Text>;
  return (
    <View style={{ display: "flex" }}>
      <Image
        source={{
          uri: bookData.img_url,
        }}
        style={{ width: 200, height: 300, borderRadius: 8 }}
      />
      <View style={{ width: 200 }}>
        <ThemedText
          style={{ fontWeight: "bold", lineHeight: 18, marginTop: 5 }}
        >
          {bookData.title}
        </ThemedText>
        <ThemedText style={{ fontSize: 14, lineHeight: 18 }}>
          by {bookData.author_list[0]}{" "}
          {bookData.author_list.length > 1
            ? `(+${bookData.author_list.length - 1})`
            : ``}
        </ThemedText>
        <BookmarkButton />
      </View>
    </View>
  );
}
