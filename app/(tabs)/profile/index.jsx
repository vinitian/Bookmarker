import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, useRouter } from "expo-router";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import UserInfo from "@/components/UserInfo";
import MyTopTen from "@/components/MyTopTen";
import MyShelf from "@/components/MyShelf";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { useState } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserName(user.displayName);
      setUserEmail(user.email);
    }
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedView
        style={{
          paddingBottom: 20,
          paddingTop: Platform.OS === "web" ? 0 : 50,
        }}
      >
        <Link href="/profile/user/1">
          <ThemedText>To user 1</ThemedText>
        </Link>
        <Link href="/">
          <ThemedText>To login</ThemedText>
        </Link>
        <ThemedView
          style={{
            alignItems: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              padding: 15,
              width: "100%",
              maxWidth: 1200,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <UserInfo
              username={userName}
              email={userEmail}
              image="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            />
            <TouchableOpacity
              onPress={() => {
                signOut(auth);
                setTimeout(() => {
                  router.navigate("/");
                }, 100);
              }}
              style={{
                backgroundColor: "#3C5433",
                width: 100,
                height: 35,
                padding: 5,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
              }}
            >
              <Text style={{ color: "#EBDF94" }}>
                {auth.currentUser ? "Sign Out" : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>
        </ThemedView>
        <MyTopTen />
        <MyShelf />
      </ThemedView>
    </ScrollView>
  );
}
