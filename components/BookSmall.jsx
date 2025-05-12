import { ThemedText } from "@/components/ThemedText";
import { Text, View, Image, Pressable, TouchableOpacity } from "react-native";
import BookmarkButton from "./BookmarkButton";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import fetchBook from "@/lib/fetchBook";

export default function BookSmall({ bookId, showRemove = false }) {
  const [bookData, setBookData] = useState(null);

  const handleBookmark = () => {
    // change context
  };
  const handleRemove = () => {
    // remove book
  };

  const router = useRouter();

  useEffect(() => {
    if (bookId) {
      fetchBook({ book_id: bookId, setBookData: setBookData });
    }
  }, [bookId]);
  if (!bookData) return <Text>Loading...</Text>;
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 8,
      }}
    >
      <Pressable onPress={() => { router.navigate(`/search/book/${bookId}`) }}>
        <Image
          source={{
            uri: bookData.img_url,
          }}
          style={{
            width: 150,
            height: 225,
            borderRadius: 8,
          }}
        />
      </Pressable>
      <View style={{ width: 170 }}>
        <ThemedText
          style={{ fontWeight: "bold", lineHeight: 18, marginTop: 5 }}
          onPress={() => { router.navigate(`/search/book/${bookId}`) }}
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
        {showRemove ? (
          <TouchableOpacity
            onPress={() => {
              handleRemove();
            }}
            style={{
              backgroundColor: "#F28A8A",
              width: "full",
              height: 30,
              marginTop: 5,
              padding: 5,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 50,
            }}
          >
            <Text style={{ color: "#fff" }}>Remove from shelf</Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
}
