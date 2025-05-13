import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { View, useWindowDimensions } from "react-native";
import BookSmall from "@/components/BookSmall";
import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import fetchUser from "@/lib/fetchUser";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import fetchBooksFromId from "@/lib/fetchBooksFromId";
import removeFromShelf from "@/lib/removeFromShelf";
import alert from "@/lib/alert";

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
  const [bookDataList, setBookDataList] = useState([]);

  useEffect(() => {
    if (user) {
      fetchBooksFromId({
        book_id_list: user.book_list.map((book) => book.book_id),
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
            {user && myUid ? (
              user.book_list.map((book, i) => (
                <BookSmall
                  key={i}
                  bookId={book.book_id}
                  bookData={bookDataList[i]}
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
                            removeFromShelf({
                              book_id: book.book_id,
                              user_id: myUid,
                              setErrorMessage: setErrorMessage,
                              loadUserData: loadUserData,
                            }),
                        },
                      ]
                    )
                  }
                />
              ))
            ) : (
              <ThemedText>Loading...</ThemedText>
            )}
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
}
