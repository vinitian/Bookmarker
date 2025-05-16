import { Link, Stack } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Oops!",
          headerTitleStyle: {
            fontFamily: "Kanit_500Medium",
          },
        }}
      />
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={{ fontSize: 24 }}>
          This screen doesn't exist.
        </ThemedText>
        <Pressable
          style={({ pressed }: { pressed: boolean }) => ({
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Link href="./" style={styles.link}>
            <ThemedText style={{ textDecorationLine: "underline" }}>
              Go to home page
            </ThemedText>
          </Link>
        </Pressable>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
