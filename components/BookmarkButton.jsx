import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function BookmarkButton({ color = "#79AB57" }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        router.push("/profile/logSession");
      }}
      style={{
        backgroundColor: color,
        width: "full",
        height: 30,
        marginTop: 5,
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
      }}
    >
      <Text style={{ color: "#fff" }}>Bookmark!</Text>
    </TouchableOpacity>
  );
}
