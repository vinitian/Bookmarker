import { ThemedText } from "@/components/ThemedText";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { View, Platform } from "react-native";
import Book from "./Book";
import { ScrollView } from "react-native";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useState, useEffect } from "react";

const fetchTopNBooks = async ({
  n,
  setTopNBooks,
}: {
  n: number;
  setTopNBooks: Function;
}) => {
  try {
    const bookQuery = query(
      collection(db, "books"),
      orderBy("rating_list", "desc"),
      orderBy("avg_rating", "desc"),
      limit(n)
    );
    const querySnapshot = await getDocs(bookQuery);
    let bookList: any[] = [];
    querySnapshot.forEach((doc) => {
      bookList.push(doc.id);
      setTopNBooks(bookList);
    });

    return setTopNBooks(bookList);
  } catch (err) {
    console.log("Error fetching book data");
    console.error(err);
  }
};

export default function MostPopularBooks() {
  const [fontsLoaded] = useFonts({
    Trirong_700Bold,
  });

  const TOP_N = 5;
  const [topNBooks, setTopNBooks] = useState<any[] | undefined>(undefined);
  useEffect(() => {
    fetchTopNBooks({
      n: TOP_N,
      setTopNBooks: setTopNBooks,
    });
    console.log(topNBooks);
  }, []);

  const CustomView = ({ children }: { children: any }) => {
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
        Most Popular Books
      </ThemedText>
      <CustomView>
        {topNBooks && topNBooks.length > 0 ? (
          topNBooks.map((book_id) => <Book key={book_id} bookId={book_id} />)
        ) : (
          <ThemedText>Loading most popular books...</ThemedText>
        )}
      </CustomView>
    </View>
  );
}
