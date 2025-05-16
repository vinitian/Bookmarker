import { ThemedText } from "@/components/ThemedText";
import { View, Platform, FlatList, Pressable } from "react-native";
import Book from "./Book";
import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import fetchBooksFromId from "@/lib/fetchBooksFromId";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function MyTopTen({
  myProfileName,
  favList,
}: {
  myProfileName: string | undefined;
  favList: string[];
}) {
  const router = useRouter();

  const [bookDataList, setBookDataList] = useState<ShortBookData[]>([]);

  useEffect(() => {
    if (favList.length > 0) {
      fetchBooksFromId({
        book_id_list: favList,
        setBookDataList: setBookDataList,
      });
    }
  }, [favList]);

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
          <Pressable
            onPress={() => {
              router.push("../../profile/myTopTen");
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
                marginBottom: Platform.OS == "web" ? 0 : 18,
              }}
            />
          </Pressable>
        ) : (
          <></>
        )}
      </View>
      <CustomView>
        {favList.length > 0 && bookDataList && bookDataList.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            contentContainerStyle={{
              display: "grid",
              flexDirection: "row",
              columnGap: 10,
              rowGap: 20,
              paddingHorizontal: 10,
              justifyContent: "space-evenly",
              gridTemplateColumns: "repeat(auto-fit,200px)",
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
