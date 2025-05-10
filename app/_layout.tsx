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
// import auth, {
//   FirebaseAuthTypes,
//   onAuthStateChanged,
// } from "@react-native-firebase/auth";
import { ThemedView } from "@/components/ThemedView";
// import { ActivityIndicator } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const AppContext = createContext<{ bookId:string, setBookId:Function } | null>(null)

export function useAppContext() {
  const context = useContext(AppContext)
  // make sure that the components using this context must be wrapped with the context provider
  if (!context) { // if context is null i.e. not available
    throw new Error('useAppContext must be used inside AppContext Provider')
  }
  return context
}

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

  const [ bookId, setBookId ] = useState("EsaXX8v0ywUEyiD9KoFs") // default selected book is "An Anthology of Australian Albums" 

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
    <AppContext.Provider value= {{ bookId, setBookId }}>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppContext.Provider>
  );
}
