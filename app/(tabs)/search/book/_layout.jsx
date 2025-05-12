import { Stack, useLocalSearchParams } from "expo-router";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[book_id]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
