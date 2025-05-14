import { ThemedText } from "@/components/ThemedText";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { View, Platform, FlatList } from "react-native";
import Book from "./Book";
import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import fetchBooksFromId from "@/lib/fetchBooksFromId";

export default function MyTopTen({ myProfileName, favList }) {
  const [fontsLoaded] = useFonts({
    Trirong_700Bold,
  });

  const [bookDataList, setBookDataList] = useState([]);

  useEffect(() => {
    if (favList.length > 0) {
      fetchBooksFromId({
        book_id_list: favList,
        setBookDataList: setBookDataList,
      });
    }
  }, [favList]);

  const CustomView = ({ children }) => {
    if (Platform.OS === "web") {
      return <View>{children}</View>;
    }
    return (
      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
        {children}
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
      }}
    >
      <ThemedText
        style={{
          fontFamily: "Trirong_700Bold",
          fontSize: 32,
          lineHeight: 40,
          paddingLeft: 15,
          marginVertical: 10,
        }}
      >
        {myProfileName == "My"
          ? "My"
          : myProfileName == undefined
          ? "Their"
          : myProfileName + "'s"}{" "}
        Top Ten
      </ThemedText>
      <CustomView>
        {favList.length > 0 && bookDataList && bookDataList.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            contentContainerStyle={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              columnGap: 10,
              rowGap: 20,
              paddingHorizontal: 10,
              justifyContent: "space-evenly",
            }}
            data={bookDataList}
            keyExtractor={(book) => book.book_id}
            renderItem={({ item }) => <Book bookData={item} />}
          />
        ) : (
          <ThemedText
            style={{
              alignSelf: "center",
              marginHorizontal: 20,
            }}
          >
            The top ten list is empty
          </ThemedText>
        )}
      </CustomView>
    </View>
  );
}
