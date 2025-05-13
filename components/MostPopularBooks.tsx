import { ThemedText } from "@/components/ThemedText";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Platform } from "react-native";
import Book from "./Book";
import { ScrollView } from "react-native";
import { useState, useEffect } from "react";
import fetchTopNBooks from "@/lib/fetchTopNBooks";
import { router } from "expo-router";

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

  const CustomView = ({ type, children }: { type: string; children: any }) => {
    if (Platform.OS === "web" || type === "search") {
      // for search page
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
      // for home page
      <ScrollView showsHorizontalScrollIndicator={true} horizontal={true}>
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
    <CustomView type={type}>
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
