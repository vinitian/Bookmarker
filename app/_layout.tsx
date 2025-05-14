import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { createContext, useContext, useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const AppContext = createContext<{
  bookId: string;
  setBookId: Function;
  queryText: string;
  setQueryText: Function;
} | null>(null);

export function useAppContext() {
  const context = useContext(AppContext);
  // make sure that the components using this context must be wrapped with the context provider
  if (!context) {
    // if context is null i.e. not available
    throw new Error("useAppContext must be used inside AppContext Provider");
  }
  return context;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [bookId, setBookId] = useState("EsaXX8v0ywUEyiD9KoFs"); // default selected book is "An Anthology of Australian Albums"
  const [queryText, setQueryText] = useState("");

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppContext.Provider value={{ bookId, setBookId, queryText, setQueryText }}>
      <ThemeProvider value={DefaultTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors[colorScheme ?? "light"].background,
            },
            headerTitleAlign: "center",
            headerTintColor: Colors[colorScheme ?? "light"].text,
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen
            name="logBookmark"
            options={{ headerShown: true, title: "Log Bookmark" }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppContext.Provider>
  );
}
