import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { FlatList, Platform, View, useWindowDimensions } from "react-native";
import BookSmall from "@/components/BookSmall";
import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import fetchUser from "@/lib/fetchUser";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import fetchBooksFromId from "@/lib/fetchBooksFromId";
import removeFromShelf from "@/lib/removeFromShelf";
import AlertModal from "@/components/AlertModal";

export default function MyShelf() {
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
    if (user && user.book_list.length > 0) {
      fetchBooksFromId({
        book_id_list: user.book_list.map((book) => book.book_id),
        setBookDataList: setBookDataList,
      });
    }
  }, [user]);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [bookIdToRemove, setBookIdToRemove] = useState("");
  const [bookNameToRemove, setBookNameToRemove] = useState("");

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
          <AlertModal
            onClose={() => setIsModalVisible(false)}
            onConfirm={() =>
              removeFromShelf({
                book_id: bookIdToRemove,
                user_id: myUid ? myUid : "",
                loadUserData: loadUserData,
              })
            }
            isVisible={isModalVisible}
          >
            <View>
              <ThemedText
                type="bold"
                style={{
                  fontSize: 18,
                  textAlign: "center",
                  marginTop: 5,
                }}
              >
                Removing a book
              </ThemedText>
              <ThemedText style={{ margin: 10 }}>
                Please confirm to remove{" "}
                <ThemedText type="bold">{bookNameToRemove}</ThemedText> from the
                shelf
              </ThemedText>
            </View>
          </AlertModal>
          {user &&
          user.book_list.length > 0 &&
          myUid &&
          bookDataList.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={{
                display: Platform.OS == "web" ? "grid" : "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                columnGap: 14,
                rowGap: 20,
                paddingHorizontal: 10,
                justifyContent: "space-evenly",
                gridTemplateColumns: "repeat(auto-fit,325px)",
              }}
              data={bookDataList}
              keyExtractor={(book: ShortBookData) => book.book_id}
              renderItem={({ item }: { item: ShortBookData }) => (
                <BookSmall
                  bookData={item}
                  handleRemove={() => {
                    setIsModalVisible(true);
                    setBookIdToRemove(item.book_id);
                    setBookNameToRemove(item.title);
                  }}
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
              The shelf is empty
            </ThemedText>
          )}
        </View>
      </ThemedView>
    </ScrollView>
  );
}
