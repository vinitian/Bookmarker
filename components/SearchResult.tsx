import { useLocalSearchParams } from "expo-router";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { useEffect, useState } from "react";
import CustomView from "./CustomView";
import { FlatList, Text } from "react-native";
import { ThemedText } from "./ThemedText";
import Book from "./Book";
import fetchBooksByQuery from "@/lib/fetchBooksByQuery";

export const SearchResult = ({
  n,
  option,
  ascending,
  pageRange,
  yearRange,
  ratingRange,
}: {
  n: number;
  option: string;
  ascending: boolean;
  pageRange: number[];
  yearRange: number[];
  ratingRange: number[];
}) => {
  const query = useLocalSearchParams<{
    q: any;
    type: string;
  }>();

  const [fontsLoaded] = useFonts({
    Trirong_700Bold,
  });

  const [books, setBooks] = useState<ShortBookData[] | undefined>(undefined);
  useEffect(() => {
    fetchBooksByQuery({
      n: n,
      setBooks: setBooks,
      type: query.type,
      q: query.q,
      option: option,
      ascending: ascending,
      pageRange: pageRange,
      yearRange: yearRange,
      ratingRange: ratingRange,
    });
  }, [query.q, query.type, pageRange, yearRange, ratingRange]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <CustomView type="search">
      {books ? (
        books.length > 0 ? (
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
            data={books}
            keyExtractor={(book) => book.book_id}
            renderItem={({ item }) => <Book bookData={item} />}
          />
        ) : (
          <ThemedText>No books match the query :(</ThemedText>
        )
      ) : (
        <ThemedText>Fetching search results...</ThemedText>
      )}
    </CustomView>
  );
};
export default SearchResult;
