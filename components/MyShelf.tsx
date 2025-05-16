import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { View, Pressable, Platform, FlatList } from "react-native";
import BookSmall from "./BookSmall";
import { ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import fetchBooksFromId from "@/lib/fetchBooksFromId";

export default function MyShelf({
  myProfileName,
  bookList,
}: {
  myProfileName: string;
  bookList: PersonalBook[];
}) {
  const router = useRouter();

  const [bookDataList, setBookDataList] = useState<ShortBookData[]>([]);

  useEffect(() => {
    if (bookList.length > 0) {
      fetchBooksFromId({
        book_id_list: bookList.map((book) => book.book_id),
        setBookDataList: setBookDataList,
      });
    }
  }, [bookList]);

  const CustomView = ({ children }: { children: any }) => {
    if (Platform.OS === "web") {
      return <View>{children}</View>;
    }
    return (
      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
        {children}
      </ScrollView>
    );
  };

  return (
    <View
      style={{
        width: "100%",
        maxWidth: 1200,
        alignSelf: "center",
        marginTop: 15,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <ThemedText
          type="title"
          style={{
            fontSize: 28,
            lineHeight: 38,
            paddingLeft: 15,
            marginVertical: 10,
          }}
        >
          {myProfileName == "My"
            ? "My"
            : myProfileName == undefined
            ? "Their"
            : myProfileName + "'s"}{" "}
          Shelf
        </ThemedText>
        {myProfileName == "My" ? (
          <Pressable
            onPress={() => {
              router.navigate("../../profile/myShelf");
            }}
            style={({ pressed }: { pressed: boolean }) => ({
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <Feather
              name="edit"
              size={24}
              color="#3C5433"
              style={{
                marginLeft: 10,
                marginBottom: Platform.OS == "web" ? 3 : 16,
              }}
            />
          </Pressable>
        ) : (
          <></>
        )}
      </View>
      <CustomView>
        {bookList.length > 0 && bookDataList && bookDataList.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            contentContainerStyle={{
              display: "grid",
              flexDirection: "row",
              columnGap: 14,
              rowGap: 20,
              paddingHorizontal: 10,
              justifyContent: "space-evenly",
              gridTemplateColumns: "repeat(auto-fit,325px)",
            }}
            data={bookDataList}
            keyExtractor={(book) => book.book_id}
            renderItem={({ item }) => (
              <BookSmall bookData={item} handleRemove={null} />
            )}
          />
        ) : (
          <ThemedText
            style={{
              alignSelf: "center",
              marginHorizontal: 20,
              marginVertical: 10,
            }}
          >
            The shelf is empty
          </ThemedText>
        )}
      </CustomView>
    </View>
  );
}
