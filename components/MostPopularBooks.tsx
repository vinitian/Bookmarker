import { ThemedText } from "@/components/ThemedText";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { FlatList } from "react-native";
import Book from "./Book";
import { useState, useEffect } from "react";
import fetchTopNBooks from "@/lib/fetchTopNBooks";
import CustomView from "./CustomView";

export default function MostPopularBooks({
  TOP_N,
  type = "home",
}: {
  TOP_N: number;
  type: string;
}) {
  const [fontsLoaded] = useFonts({
    Trirong_700Bold,
  });
  const [topNBooks, setTopNBooks] = useState<ShortBookData[] | undefined>(
    undefined
  );
  useEffect(() => {
    fetchTopNBooks({
      n: TOP_N,
      setTopNBooks: setTopNBooks,
    });
  }, []);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <CustomView type={type}>
      {topNBooks && topNBooks.length > 0 ? (
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
          data={topNBooks}
          keyExtractor={(book) => book.book_id}
          renderItem={({ item }) => <Book bookData={item} />}
        />
      ) : (
        <ThemedText>Loading most popular books...</ThemedText>
      )}
    </CustomView>
  );
}
