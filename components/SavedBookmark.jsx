import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import React from "react";

export default function SavedBookmark() {
  const EditButton = () => (
    <TouchableOpacity
      onPress={() => {}}
      style={{
        backgroundColor: "#79AB57",
        paddingVertical: 5,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        width: "fit-content",
      }}
    >
      <Text style={{ color: "#fff" }}>Edit</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <ThemedText
          style={{ fontWeight: "bold", fontSize: 18, marginVertical: 5 }}
        >
          11/08/2025
        </ThemedText>
        <EditButton />
      </View>
      <View style={styles.infoContainer}>
        <ThemedText>12:00 - 16:25</ThemedText>
        <ThemedText>265 min</ThemedText>
      </View>
      <View style={styles.infoContainer}>
        <ThemedText>page 51 - 152</ThemedText>
        <ThemedText>102 pages</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 2,
  },
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 50,
  },
});
