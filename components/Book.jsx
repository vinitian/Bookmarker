import { ThemedText } from "@/components/ThemedText";
import { Text, View, Image, Pressable } from "react-native";
import { useState } from "react";
import BookmarkButton from "./BookmarkButton";
import { useRouter } from "expo-router";

export default function Book({ bookData }) {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);

  if (!bookData) return <Text>Loading...</Text>;
  return (
    <View style={{ display: "flex" }}>
      <Pressable
        onHoverIn={() => setIsFocused(true)}
        onHoverOut={() => setIsFocused(false)}
        onPress={() => {
          setIsFocused(true);
          router.navigate(`/book/${bookData.book_id}`);
        }}
      >
        <Image
          source={{
            uri: bookData.img_url,
          }}
          style={{
            width: 200,
            height: 300,
            borderRadius: 8,
            opacity: isFocused ? 0.9 : 1,
          }}
        />
      </Pressable>
      <View style={{ width: 200 }}>
        <ThemedText
          style={{ fontWeight: "bold", lineHeight: 18, marginTop: 5 }}
          onPress={() => {
            router.navigate(`/book/${bookData.book_id}`);
          }}
        >
          {bookData.title}
        </ThemedText>
        <ThemedText style={{ fontSize: 14, lineHeight: 18 }}>
          by {bookData.author_list[0]}{" "}
          {bookData.author_list.length > 1
            ? `(+${bookData.author_list.length - 1})`
            : ``}
        </ThemedText>
        <BookmarkButton thisBookId={bookData.book_id} />
      </View>
    </View>
  );
}
