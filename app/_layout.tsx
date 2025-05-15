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
  queryText: string;
  setQueryText: Function;
  type: string;
  setType: Function;
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

  const [queryText, setQueryText] = useState("");
  const [type, setType] = useState("title");

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppContext.Provider value={{ queryText, setQueryText, type, setType }}>
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
