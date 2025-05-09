import { Stack, useLocalSearchParams } from "expo-router";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[user_id]"
        options={{ headerShown: true, title: "View Profile" }}
      />
    </Stack>
  );
}
