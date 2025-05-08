import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { Link } from "expo-router";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from "react-native";
import BookSmall from "@/components/BookSmall";
import { ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function MyShelf() {
  const { width, height } = useWindowDimensions();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: "#F7F0DD" }}>
        <ThemedView
          style={{
            width: "100%",
            maxWidth: 1200,
            minHeight: height,
            alignSelf: "center",
            paddingVertical: 20,
          }}
        >
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
            <BookSmall
              handleBookmark={"handleBookmarkFunction"}
              handleRemove={"handleRemoveFunction"}
              image={
                "http://books.google.com/books/content?id=yQvBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
              }
              name={"An Anthology of Australian Albums"}
              authors={["Jon Stratton", "Jon Dale", "Tony Mitchell"]}
            />
            <BookSmall
              handleBookmark={"handleBookmarkFunction"}
              handleRemove={"handleRemoveFunction"}
              image={
                "http://books.google.com/books/content?id=yQvBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
              }
              name={"Web Search: Public Searching of the Web"}
              authors={["Jon Stratton", "Jon Dale", "Tony Mitchell"]}
            />
            <BookSmall
              handleBookmark={"handleBookmarkFunction"}
              handleRemove={"handleRemoveFunction"}
              image={
                "http://books.google.com/books/content?id=yQvBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
              }
              name={"Web Search: Public Searching of the Web"}
              authors={["Jon Stratton", "Jon Dale", "Tony Mitchell"]}
            />
            <BookSmall
              handleBookmark={"handleBookmarkFunction"}
              handleRemove={"handleRemoveFunction"}
              image={
                "http://books.google.com/books/content?id=yQvBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
              }
              name={"Web Search: Public Searching of the Web"}
              authors={["Jon Stratton", "Jon Dale", "Tony Mitchell"]}
            />
            <BookSmall
              handleBookmark={"handleBookmarkFunction"}
              handleRemove={"handleRemoveFunction"}
              image={
                "http://books.google.com/books/content?id=yQvBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
              }
              name={"Web Search: Public Searching of the Web"}
              authors={["Jon Stratton", "Jon Dale", "Tony Mitchell"]}
            />
          </View>
        </ThemedView>
      </View>
    </ScrollView>
  );
}
