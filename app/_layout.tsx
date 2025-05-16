import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { createContext, useContext, useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Kanit_300Light, Kanit_500Medium } from "@expo-google-fonts/kanit";
import {
  Trirong_700Bold,
  Trirong_500Medium,
  useFonts,
} from "@expo-google-fonts/trirong";

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
  const [queryText, setQueryText] = useState("");
  const [type, setType] = useState("title");
  const [loaded] = useFonts({
    Kanit_300Light,
    Kanit_500Medium,
    Trirong_700Bold,
    Trirong_500Medium,
  });

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
            headerTitleStyle: {
              fontFamily: "Kanit_500Medium",
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
          <Stack.Screen
            name="book"
            options={{ headerShown: true, title: "Book Information" }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppContext.Provider>
  );
}
