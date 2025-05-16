import { Redirect, useRouter } from "expo-router";
import { auth } from "@/firebaseConfig";
import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Text, Pressable } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function ProfileIndexPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (user) setUserId(user.uid);
  });

  if (userId) return <Redirect href={`./profile/user/${userId}`} />;
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
      <Pressable
        onPress={() => {
          router.navigate("../../login");
        }}
        style={({ pressed }) => ({
          backgroundColor: "#79AB57",
          height: 30,
          marginTop: 20,
          paddingVertical: 20,
          paddingHorizontal: 15,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 50,
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <Text
          style={{
            color: "#fff",
            fontFamily: "Kanit_500Medium",
            fontSize: 18,
            height: 24,
            lineHeight: 24,
          }}
        >
          Go to login page
        </Text>
      </Pressable>
    </ThemedView>
  );
}
