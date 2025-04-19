import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: true, title: "My Profile" }}
      />
      <Stack.Screen name="user" options={{ headerShown: false }} />
    </Stack>
  );
}
