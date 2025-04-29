import { View, Text, Image, Platform, TouchableOpacity } from "react-native";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import BookmarkButton from "../../../components/BookmarkButton";

export default function logSession() {
  const image =
    "http://books.google.com/books/content?id=yQvBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api";
  const name = "An Anthology of Australian Albums";
  const authors = ["Jon Stratton", "Jon Dale", "Tony Mitchell"];
  const [fontsLoaded] = useFonts({
    Trirong_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }
  const CustomView = ({ children }) => {
    if (Platform.OS === "web") {
      return (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            width: 200,
          }}
        >
          <Image
            source={{
              uri: image,
            }}
            style={{
              width: 200,
              height: 300,
              borderRadius: 8,
            }}
          />
          {children}
        </View>
      );
    }
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
        }}
      >
        <Image
          source={{
            uri: image,
          }}
          style={{
            width: 150,
            height: 225,
            borderRadius: 8,
          }}
        />
        {children}
      </View>
    );
  };

  return (
    <ThemedView style={{ paddingVertical: 20 }}>
      <View style={{ width: "fit-content" }}>
        <CustomView>
          <View
            style={{
              maxWidth: 200,
              width: "fit-content",
            }}
          >
            <ThemedText
              style={{
                lineHeight: 20,
                marginTop: 5,
                fontFamily: "Trirong_700Bold",
              }}
            >
              {name}
            </ThemedText>
            <ThemedText style={{ fontSize: 14, lineHeight: 18 }}>
              by {authors[0]}{" "}
              {authors.length > 1 ? `(+${authors.length - 1})` : ``}
            </ThemedText>
            <Text style={{ color: "#79AB57", fontFamily: "Trirong_700Bold" }}>
              Hours read: 00
            </Text>
            <Text style={{ color: "#79AB57", fontFamily: "Trirong_700Bold" }}>
              Pages read: 000
            </Text>
          </View>
        </CustomView>
        <TouchableOpacity
          onPress={() => {}}
          style={{
            backgroundColor: "#79AB57",
            width: 200,
            height: 30,
            marginTop: 10,
            padding: 5,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            borderRadius: 50,
          }}
        >
          <Text style={{ color: "#fff" }}>Add a Bookmark</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
