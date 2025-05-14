import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { FlatList, View, useWindowDimensions } from "react-native";
import BookSmall from "@/components/BookSmall";
import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import fetchUser from "@/lib/fetchUser";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import fetchBooksFromId from "@/lib/fetchBooksFromId";
import alert from "@/lib/alert";
import removeFromTopTen from "@/lib/removeFromTopTen";

export default function MyTopTen() {
  const { width, height } = useWindowDimensions();

  const [user, setUserData] = useState<User | undefined>(undefined);

  const [myUid, setMyUid] = useState<string | null>("");
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setMyUid(user.uid);
      }
    });
  }, []);

  useEffect(() => {
    loadUserData();
  }, [myUid]);

  const loadUserData = () => {
    if (myUid) {
      fetchUser({ user_id: myUid, setUserData: setUserData });
    }
  };

  // fetch book data
  const [bookDataList, setBookDataList] = useState<ShortBookData[]>([]);

  useEffect(() => {
    if (user && user.fav_list.length > 0) {
      fetchBooksFromId({
        book_id_list: user.fav_list,
        setBookDataList: setBookDataList,
      });
    }
  }, [user]);

  const [errorMessage, setErrorMessage] = useState<string>("");

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedView>
        <View
          style={{
            width: "100%",
            maxWidth: 1200,
            minHeight: height,
            alignSelf: "center",
            paddingVertical: 20,
          }}
        >
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
            {user &&
            user.book_list.length > 0 &&
            myUid &&
            bookDataList.length > 0 ? (
              <FlatList
                scrollEnabled={false}
                contentContainerStyle={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  columnGap: 14,
                  rowGap: 20,
                  paddingHorizontal: 10,
                  justifyContent: "space-evenly",
                }}
                data={bookDataList}
                keyExtractor={(book: ShortBookData) => book.book_id}
                renderItem={({ item }: { item: ShortBookData }) => (
                  <BookSmall
                    bookData={item}
                    handleRemove={() =>
                      alert(
                        "Removing a book",
                        "Please confirm to remove a book",
                        [
                          {
                            text: "Cancel",
                            onPress: () => {},
                            style: "cancel",
                          },
                          {
                            text: "Remove",
                            onPress: () =>
                              removeFromTopTen({
                                book_id: item.book_id,
                                user_id: myUid,
                                setErrorMessage: setErrorMessage,
                                loadUserData: loadUserData,
                              }),
                          },
                        ]
                      )
                    }
                  />
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
                The Top Ten is empty
              </ThemedText>
            )}
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
}
