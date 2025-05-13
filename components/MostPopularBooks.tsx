import { ThemedText } from "@/components/ThemedText";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { View, Platform } from "react-native";
import Book from "./Book";
import { ScrollView } from "react-native";
import { useState, useEffect } from "react";
import fetchTopNBooks from "@/lib/fetchTopNBooks";

export default function MostPopularBooks({ TOP_N }: { TOP_N: number }) {
  const [fontsLoaded] = useFonts({
    Trirong_700Bold,
  });
  const [topNBooks, setTopNBooks] = useState<
    { id: string; data: object }[] | undefined
  >(undefined);
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
    <CustomView>
      {topNBooks && topNBooks.length > 0 ? (
        topNBooks.map((book: { id: string; data: object }) => (
          <Book key={book.id} bookId={book.id} bookData={book.data} />
        ))
      ) : (
        <ThemedText>Loading most popular books...</ThemedText>
      )}
    </CustomView>
  );
}
