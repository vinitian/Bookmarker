import { ThemedText } from "@/components/ThemedText";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { View, Platform, FlatList } from "react-native";
import Book from "./Book";
import { ScrollView } from "react-native";
import { useState, useEffect } from "react";
import fetchTopNBooks from "@/lib/fetchTopNBooks";

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

  const CustomView = ({ type, children }: { type: string; children: any }) => {
    if (Platform.OS === "web" || type === "search") {
      // for search page
      return <View>{children}</View>;
    }
    return (
      // for home page
      <ScrollView showsHorizontalScrollIndicator={true} horizontal={true}>
        {children}
      </ScrollView>
    );
  };

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
