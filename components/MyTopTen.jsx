import { ThemedText } from "@/components/ThemedText";
import { View, Platform, FlatList, TouchableOpacity } from "react-native";
import Book from "./Book";
import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import fetchBooksFromId from "@/lib/fetchBooksFromId";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function MyTopTen({ myProfileName, favList }) {

  const router = useRouter();

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

  return (
    <View
      style={{
        width: "100%",
        maxWidth: 1200,
        alignSelf: "center",
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
        {myProfileName == "My" ? (
          <TouchableOpacity
            onPress={() => {
              router.push("/profile/myTopTen");
            }}
          >
            <Feather
              name="edit"
              size={24}
              color="#3C5433"
              style={{
                marginLeft: 10,
                marginBottom: Platform.OS == "web" ? 0 : 18,
              }}
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
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
            The Top Ten list is empty
          </ThemedText>
        )}
      </CustomView>
    </View>
  );
}
