import { ThemedText } from "@/components/ThemedText";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { View, Platform } from "react-native";
import Book from "./Book";
import { ScrollView } from "react-native";

export default function MyTopTen() {
  const [fontsLoaded] = useFonts({
    Trirong_700Bold,
  });

  const CustomView = ({ children }) => {
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
        My Top Ten
      </ThemedText>
      <CustomView>
        <Book
          image={
            "http://books.google.com/books/content?id=yQvBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
          }
          name={"An Anthology of Australian Albums"}
          authors={["Jon Stratton", "Jon Dale", "Tony Mitchell"]}
        />
        <Book
          image={
            "http://books.google.com/books/content?id=yQvBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
          }
          name={"Web Search: Public Searching of the Web"}
          authors={["Jon Stratton", "Jon Dale", "Tony Mitchell"]}
        />
        <Book
          image={
            "http://books.google.com/books/content?id=yQvBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
          }
          name={"Web Search: Public Searching of the Web"}
          authors={["Jon Stratton", "Jon Dale", "Tony Mitchell"]}
        />
        <Book
          image={
            "http://books.google.com/books/content?id=yQvBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
          }
          name={"Web Search: Public Searching of the Web"}
          authors={["Jon Stratton", "Jon Dale", "Tony Mitchell"]}
        />
        <Book
          image={
            "http://books.google.com/books/content?id=yQvBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
          }
          name={"Web Search: Public Searching of the Web"}
          authors={["Jon Stratton", "Jon Dale", "Tony Mitchell"]}
        />
      </CustomView>
    </View>
  );
}
