import { Redirect, useRouter } from "expo-router";
import { auth } from "@/firebaseConfig";
import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Text, TouchableOpacity, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function HomeScreen() {
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (user) setUserId(user.uid);
  });

  if (userId) return <Redirect href={"/profile/user/" + userId} />;
  return (
    <ThemedView
      style={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText style={{ fontSize: 18 }}>You're not logged in</ThemedText>
      <TouchableOpacity
        onPress={() => {
          router.push("/login");
        }}
        style={{
          backgroundColor: "#79AB57",
          height: 30,
          marginTop: 20,
          paddingVertical: 20,
          paddingHorizontal: 15,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 50,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
            height: 24,
          }}
        >
          Go to login page
        </Text>
      </TouchableOpacity>
    </ThemedView>
  );
}
