import { Text, View, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";

export default function UserInfo({ username, email, image }) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
      }}
    >
      <Image
        source={{
          uri: image,
        }}
        style={{ width: 70, height: 70 }}
      />
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <ThemedText style={{ fontSize: 16 }}>{username}</ThemedText>
        <ThemedText style={{ fontSize: 14 }}>{email}</ThemedText>
      </View>
    </View>
  );
}
