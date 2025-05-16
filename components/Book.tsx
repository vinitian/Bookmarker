import { ThemedText } from "@/components/ThemedText";
import { Text, View, Image, Pressable } from "react-native";
import { useState } from "react";
import BookmarkButton from "./BookmarkButton";
import { useRouter } from "expo-router";
import { StarRatingDisplay } from "react-native-star-rating-widget";

export default function Book({
  bookData,
}: {
  bookData: ShortBookData | ShortBookDataWithRating;
}) {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const isShortBookDataWithRating = (
    book: any
  ): book is ShortBookDataWithRating => book.user_rating;

  if (!bookData) return <Text>Loading...</Text>;
  return (
    <View style={{ display: "flex" }}>
      <Pressable
        onHoverIn={() => setIsFocused(true)}
        onHoverOut={() => setIsFocused(false)}
        onPress={() => {
          setIsFocused(true);
          router.navigate(`../../../book/${bookData.book_id}`);
        }}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
        })}
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
          type="bold"
          style={{ marginTop: 5 }}
          onPress={() => {
            router.navigate(`../../../book/${bookData.book_id}`);
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
        {isShortBookDataWithRating(bookData) ? (
          bookData.user_rating != -1 ? (
            <StarRatingDisplay
              rating={bookData.user_rating}
              color="#e2bd04"
              starSize={18}
              starStyle={{
                alignSelf: "center",
              }}
            />
          ) : (
            <ThemedText style={{ fontSize: 14, fontStyle: "italic" }}>
              No rating
            </ThemedText>
          )
        ) : (
          <></>
        )}
        <BookmarkButton thisBookId={bookData.book_id} />
      </View>
    </View>
  );
}
