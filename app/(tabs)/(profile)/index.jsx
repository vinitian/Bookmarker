import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <ThemedView>
      <ThemedText>Profile Page</ThemedText>
      <Link href="user/1">
        <ThemedText>To user 1</ThemedText>
      </Link>
      <ThemedText></ThemedText>
    </ThemedView>
  );
}
