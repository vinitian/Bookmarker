import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import CustomView from "./CustomView";
import { FlatList, Text } from "react-native";
import Book from "./Book";
import fetchBooksByQuery from "@/lib/fetchBooksByQuery";
import { useAppContext } from "@/app/_layout";
import { ThemedText } from "./ThemedText";

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
  const query = useLocalSearchParams<{ type: string; q: string }>();
  const { queryText, setQueryText, type, setType } = useAppContext();
  useEffect(() => {
    if (query) {
      setQueryText(query.q);
      setType(query.type);
    }
  }, []);

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

  return (
    <CustomView type="search">
      {books ? (
        books.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            contentContainerStyle={{
              display: "grid",
              flexDirection: "row",
              columnGap: 14,
              rowGap: 20,
              paddingHorizontal: 10,
              justifyContent: "space-evenly",
              gridTemplateColumns: "repeat(auto-fit,200px)",
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
