import { ThemedText } from "@/components/ThemedText";
import { FlatList, Platform } from "react-native";
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
  const [topNBooks, setTopNBooks] = useState<ShortBookData[] | undefined>(
    undefined
  );
  useEffect(() => {
    fetchTopNBooks({
      n: TOP_N,
      setTopNBooks: setTopNBooks,
    });
  }, []);

  return (
    <CustomView type={type}>
      {topNBooks && topNBooks.length > 0 ? (
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
            gridTemplateColumns: "repeat(auto-fit,200px)",
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
