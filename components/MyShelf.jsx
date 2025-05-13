import { ThemedText } from "@/components/ThemedText";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { useRouter } from "expo-router";
import { View, TouchableOpacity, Platform } from "react-native";
import BookSmall from "./BookSmall";
import { ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import fetchBooksFromId from "@/lib/fetchBooksFromId";

export default function MyShelf({ myProfileName, bookList }) {
  const [fontsLoaded] = useFonts({
    Trirong_700Bold,
  });

  const router = useRouter();

  const [bookDataList, setBookDataList] = useState([]);

  useEffect(() => {
    fetchBooksFromId({
      book_id_list: bookList.map((book) => book.book_id),
      setBookDataList: setBookDataList,
    });
    console.log("shelf useEffect");
  }, [bookList]);

  const CustomView = ({ children }) => {
    if (Platform.OS === "web") {
      return (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            columnGap: 10,
            rowGap: 20,
            paddingHorizontal: 10,
            justifyContent: "space-evenly",
          }}
        >
          {children}
        </View>
      );
    }
    return (
      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 14,
            paddingHorizontal: 10,
          }}
        >
          {children}
        </View>
      </ScrollView>
    );
  };

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View
      style={{
        width: "100%",
        maxWidth: 1200,
        alignSelf: "center",
        marginTop: 20,
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
          style={{
            fontFamily: "Trirong_700Bold",
            fontSize: 28,
            paddingLeft: 15,
            lineHeight: 48,
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
          <TouchableOpacity
            onPress={() => {
              router.push("/profile/myShelf");
            }}
          >
            <Feather
              name="edit"
              size={24}
              color="#3C5433"
              style={{ marginLeft: 10, marginBottom: 4 }}
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
      <CustomView>
        {bookList.length > 0 ? (
          bookList.map((book, i) => (
            <BookSmall
              key={i}
              bookId={book.book_id}
              bookData={bookDataList[i]}
            />
          ))
        ) : (
          <ThemedText>The shelf is empty</ThemedText>
        )}
      </CustomView>
    </View>
  );
}
