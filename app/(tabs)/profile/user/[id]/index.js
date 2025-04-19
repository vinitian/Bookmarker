import { View, Text } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { useLocalSearchParams } from "expo-router";

export default function UserPage() {
  const { id } = useLocalSearchParams();
  return (
    <ThemedView>
      <ThemedText>user id: {id}</ThemedText>
    </ThemedView>
  );
}
