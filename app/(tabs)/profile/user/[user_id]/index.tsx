import { useEffect, useState } from "react";
import { Redirect, useLocalSearchParams, Link, useRouter } from "expo-router";
import fetchUser from "@/lib/fetchUser";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
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

export default function UserProfile() {
  const local = useLocalSearchParams<{ user_id: string }>();
  let user_id: string = local.user_id;

  const router = useRouter();
  const [myUid, setMyUid] = useState<string | null>("");
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setMyUid(user.uid);
    }
  });

  const [user, setUserData] = useState<User | undefined>(undefined);
  const [IsDataFetched, setIsDataFetched] = useState<boolean>(false);
  useEffect(() => {
    fetchUser({ user_id: user_id, setUserData: setUserData });
  }, [user_id]);

  const BackButton = () => {
    const path = myUid ? "profile/user/" + myUid : "/profile";
    return (
      <TouchableOpacity
        onPress={() => router.replace(path)}
        style={{
          backgroundColor: "#79AB57",
          height: 30,
          marginTop: 5,
          paddingVertical: 5,
          paddingHorizontal: 15,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 50,
        }}
      >
        <Text style={{ color: "#fff" }}>Go back to my profile</Text>
      </TouchableOpacity>
    );
  };

  if (!user)
    return (
      <ThemedView
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemedText>User not found</ThemedText>
        <BackButton />
      </ThemedView>
    );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedView
        style={{
          paddingBottom: 20,
          paddingTop: Platform.OS === "web" ? 0 : 50,
        }}
      >
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
              username={user.name}
              email={user.email}
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
