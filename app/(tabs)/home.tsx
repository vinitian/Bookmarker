import { Image, StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  NotoSansThaiLooped_400Regular,
  useFonts,
} from "@expo-google-fonts/noto-sans-thai-looped";
import { Trirong_700Bold } from "@expo-google-fonts/trirong";
import { SearchBar } from "@/components/SearchBar";
import MostPopularBooks from "@/components/MostPopularBooks";

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    NotoSansThaiLooped_400Regular,
    Trirong_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
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
        }}
      >
        <ThemedText
          type="title"
          style={{ fontFamily: "Trirong_700Bold", textAlign: "center" }}
        >
          Welcome to Bookmarker
        </ThemedText>
        <SearchBar />
        <MostPopularBooks />
      </ThemedView>
      {/* <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. Press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: "cmd + d",
              android: "cmd + m",
              web: "F12",
            })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{" "}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView> */}
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
