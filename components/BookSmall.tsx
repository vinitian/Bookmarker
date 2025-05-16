import { ThemedText } from "@/components/ThemedText";
import { Text, View, Image, Pressable, Platform } from "react-native";
import BookmarkButton from "./BookmarkButton";
import { useRouter } from "expo-router";

export default function BookSmall({
  bookData,
  handleRemove = null,
}: {
  bookData: ShortBookData;
  handleRemove: Function | null;
}) {
  const router = useRouter();

  if (!bookData) return <Text>Loading...</Text>;
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 8,
      }}
    >
      <Pressable
        onPress={() => {
          router.navigate(`../../../book/${bookData.book_id}`);
        }}
        style={({ pressed }: { pressed: boolean }) => ({
          opacity: pressed ? 0.5 : 1,
        })}
      >
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
          type="bold"
          style={{ lineHeight: 18, paddingTop: 5 }}
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
        <BookmarkButton thisBookId={bookData.book_id} />
        {handleRemove != null ? (
          <Pressable
            onPress={() => {
              handleRemove();
            }}
            style={({ pressed }: { pressed: boolean }) => ({
              backgroundColor: "#F28A8A",
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
              Remove book
            </ThemedText>
          </Pressable>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
}
