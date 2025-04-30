import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
// import auth, {
//   FirebaseAuthTypes,
//   onAuthStateChanged,
// } from "@react-native-firebase/auth";
import { ThemedView } from "@/components/ThemedView";
// import { ActivityIndicator } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  // const [initializing, setInitializing] = useState(true);
  // const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  // const onAuthStateChanged1 = (user: FirebaseAuthTypes.User | null) => {
  //   console.log("onAuthStateChanged", user);
  //   setUser(user);
  //   if (initializing) setInitializing(false);
  // };

  // useEffect(() => {
  //   // const subscriber = auth().onAuthStateChanged(onAuthStateChanged1);
  //   onAuthStateChanged(auth(), (user) => {
  //     onAuthStateChanged1(user);
  //     return user;
  //   });
  //   // return subscriber;
  // }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // if (initializing) {
  //   return (
  //     <ThemedView
  //       style={{
  //         alignItems: "center",
  //         justifyContent: "center",
  //         flex: 1,
  //       }}
  //     >
  //       <ActivityIndicator size="large" />
  //     </ThemedView>
  //   );
  // }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
