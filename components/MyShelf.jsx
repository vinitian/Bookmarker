import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { Link } from "expo-router";
import { Text, View, Image, TouchableOpacity, Platform } from "react-native";
import BookSmall from "./BookSmall";
import { ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function MyShelf() {
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
            gap: 14,
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
        maxWidth: 1100,
        alignSelf: "center",
        marginTop: 20,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <ThemedText
          style={{
            fontFamily: "Trirong_700Bold",
            fontSize: 24,
            paddingLeft: 15,
            lineHeight: 48,
          }}
        >
          My Shelf
        </ThemedText>
        <TouchableOpacity onPress={() => {}}>
          <Feather
            name="edit"
            size={24}
            color="#3C5433"
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>
      </View>
      <CustomView>
        <BookSmall
          image={
            "http://books.google.com/books/content?id=yQvBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
          }
          name={"An Anthology of Australian Albums"}
          authors={["Jon Stratton", "Jon Dale", "Tony Mitchell"]}
        />
        <BookSmall
          image={
            "http://books.google.com/books/content?id=yQvBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
          }
          name={"Web Search: Public Searching of the Web"}
          authors={["Jon Stratton", "Jon Dale", "Tony Mitchell"]}
        />
        <BookSmall
          image={
            "http://books.google.com/books/content?id=yQvBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
          }
          name={"Web Search: Public Searching of the Web"}
          authors={["Jon Stratton", "Jon Dale", "Tony Mitchell"]}
        />
        <BookSmall
          image={
            "http://books.google.com/books/content?id=yQvBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
          }
          name={"Web Search: Public Searching of the Web"}
          authors={["Jon Stratton", "Jon Dale", "Tony Mitchell"]}
        />
        <BookSmall
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
