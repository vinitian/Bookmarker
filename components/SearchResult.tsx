import { useEffect, useState } from "react";
import CustomView from "./CustomView";
import { FlatList, Platform } from "react-native";
import Book from "./Book";
import fetchBooksByQuery from "@/lib/fetchBooksByQuery";
import { ThemedText } from "./ThemedText";

export const SearchResult = ({
  q,
  type,
  option,
  ascending,
  pageRange,
  yearRange,
  ratingRange,
}: {
  q: string;
  type: string;
  option: string;
  ascending: boolean;
  pageRange: number[];
  yearRange: number[];
  ratingRange: number[];
}) => {
  const [books, setBooks] = useState<ShortBookData[] | undefined>(undefined);
  useEffect(() => {
    fetchBooksByQuery({
      setBooks: setBooks,
      type: type,
      q: q,
      option: option,
      ascending: ascending,
      pageRange: pageRange,
      yearRange: yearRange,
      ratingRange: ratingRange,
    });
  }, [q, type, option, ascending, pageRange, yearRange, ratingRange]);

  return (
    <CustomView type="search">
      {books ? (
        books.length > 0 ? (
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
