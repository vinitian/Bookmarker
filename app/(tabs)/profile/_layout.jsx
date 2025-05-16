import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function StackLayout() {
  const colorScheme = useColorScheme();
  return (
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
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "My Profile" }}
      />
      <Stack.Screen name="user" options={{ headerShown: false }} />
      <Stack.Screen
        name="myShelf"
        options={{ headerShown: true, title: "My Shelf" }}
      />
      <Stack.Screen
        name="myTopTen"
        options={{ headerShown: true, title: "My Top Ten" }}
      />
    </Stack>
  );
}
