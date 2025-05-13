import { ThemedText } from "@/components/ThemedText";
import { Text, View, Image, Pressable } from "react-native";
import BookmarkButton from "./BookmarkButton";
import { useRouter } from "expo-router";

export default function Book({ bookId, bookData }) {
  const router = useRouter();

  if (!bookData) return <Text>Loading...</Text>;
  return (
    <View style={{ display: "flex" }}>
      <Pressable
        onPress={() => {
          router.navigate(`/search/book/${bookId}`);
        }}
      >
        <Image
          source={{
            uri: bookData.img_url,
          }}
          style={{ width: 200, height: 300, borderRadius: 8 }}
        />
      </Pressable>
      <View style={{ width: 200 }}>
        <ThemedText
          style={{ fontWeight: "bold", lineHeight: 18, marginTop: 5 }}
          onPress={() => {
            router.navigate(`/search/book/${bookId}`);
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
        <BookmarkButton thisBookId={bookId} />
      </View>
    </View>
  );
}
