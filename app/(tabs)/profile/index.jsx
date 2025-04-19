import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <ThemedView>
      <ThemedText>Profile Page</ThemedText>
      <Link href="/profile/user/1">
        <ThemedText>To user 1</ThemedText>
      </Link>
      <Link href="/">
        <ThemedText>To login</ThemedText>
      </Link>
      <ThemedText></ThemedText>
    </ThemedView>
  );
}
