import { ThemedText } from "@/components/ThemedText";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { View, Platform } from "react-native";
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
    fetchBooksFromId({
      book_id_list: favList,
      setBookDataList: setBookDataList,
    });
  }, [favList]);

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
            gap: 10,
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
      <ThemedText
        style={{
          fontFamily: "Trirong_700Bold",
          fontSize: 32,
          lineHeight: 60,
          paddingLeft: 15,
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
        {bookDataList.length > 0 ? (
          bookDataList.map((bookData, i) => (
            <Book key={i} bookId={favList[i]} bookData={bookData} />
          ))
        ) : (
          <ThemedText>The top ten list is empty</ThemedText>
        )}
      </CustomView>
    </View>
  );
}
