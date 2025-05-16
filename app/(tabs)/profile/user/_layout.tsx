import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[user_id]"
        options={{ headerShown: false, title: "View Profile" }}
      />
    </Stack>
  );
}
