import { View, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
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
        style={{ width: 70, height: 70, borderRadius: 100 }}
      />
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <ThemedText style={{ fontSize: 20, fontWeight: "bold" }}>
          {username}
        </ThemedText>
        <ThemedText style={{ fontSize: 14 }}>{email}</ThemedText>
      </View>
    </View>
  );
}
