import { Image, Text, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SearchBar } from "@/components/SearchBar";
import MostPopularBooks from "@/components/MostPopularBooks";
import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default function HomeScreen() {
  const router = useRouter();
  const [isUser, setIsUser] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) setIsUser(true);
  });
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "white", dark: "dark" }}
      headerImage={
        <Image
          source={require("@/assets/images/parallax-background.jpg")}
          style={{ height: "100%", width: "100%" }}
          blurRadius={3}
        />
      }
    >
      <ThemedView
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        <ThemedText
          type="title"
          style={{
            fontSize: 36,
            textAlign: "center",
            lineHeight: 50,
            marginVertical: 10,
          }}
        >
          Welcome to Bookmarker
        </ThemedText>
        <SearchBar page="home" />
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
              lineHeight: 45,
              paddingLeft: 15,
              marginBottom: 10,
            }}
          >
            Most Popular Books
          </ThemedText>
          <MostPopularBooks TOP_N={10} type="home" />
        </View>
        {isUser ? (
          <></>
        ) : (
          <>
            {/* Horizontal line */}
            <View
              style={{
                marginVertical: 30,
                width: "75%",
                paddingVertical: 0.5,
                backgroundColor: "#3C5433",
              }}
            />
            {/* Sign in / sign up button */}
            <Pressable
              onPress={() => router.navigate("../../login")}
              style={({ pressed }: { pressed: boolean }) => ({
                borderRadius: 50,
                backgroundColor: "#3C5433",
                padding: 10,
                paddingHorizontal: 20,
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Sign In / Sign Up
              </Text>
            </Pressable>
          </>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
