import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import fetchUser from "@/lib/fetchUser";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  useWindowDimensions,
  RefreshControl,
} from "react-native";
import UserInfo from "@/components/UserInfo";
import MyTopTen from "@/components/MyTopTen";
import MyReadingGraph from "@/components/MyReadingGraph";
import MyShelf from "@/components/MyShelf";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function UserProfile() {
  const router = useRouter();
  const local = useLocalSearchParams<{ user_id: string }>();
  let user_id: string = local.user_id;

  const [user, setUserData] = useState<User | undefined>(undefined);
  const [myProfileName, setMyProfileName] = useState<undefined | "My" | string>(
    undefined
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [myUid, setMyUid] = useState<string | null>("");
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setMyUid(user.uid);
      }
    });
  }, []);

  useEffect(() => {
    loadUserData();
  }, [user_id]);

  const loadUserData = () => {
    fetchUser({ user_id: user_id, setUserData: setUserData });
    setRefreshing(false);
  };

  useEffect(() => {
    if (user_id == myUid) {
      setMyProfileName("My");
    } else {
      setMyProfileName(user?.name);
    }
  }, [myUid, user]);

  const BackButton = () => {
    return (
      <TouchableOpacity
        onPress={() => router.navigate("/profile")}
        style={{
          height: 30,
          marginTop: 5,
          paddingVertical: 5,
          paddingHorizontal: 15,
          alignItems: "flex-start",
          justifyContent: "center",
          borderRadius: 50,
        }}
      >
        <Text style={{ color: "#3C5433", fontFamily: "Kanit_500Medium" }}>
          {"< "}
          <Text style={{ textDecorationLine: "underline" }}>
            Go back to my profile
          </Text>
        </Text>
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
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadUserData} />
      }
    >
      <ThemedView
        style={{
          minHeight: 850,
          paddingBottom: 20,
          paddingTop: Platform.OS === "web" ? 0 : 50,
        }}
      >
        {myProfileName == "My" ? <></> : <BackButton />}
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
              image={user.image}
            />
            {myProfileName == "My" ? (
              <TouchableOpacity
                onPress={() => {
                  signOut(auth);
                  setMyUid(null);
                  setTimeout(() => {
                    router.navigate("/login");
                  }, 100);
                }}
                style={{
                  backgroundColor: "#3C5433",
                  width: 100,
                  height: 40,
                  padding: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 50,
                }}
              >
                <ThemedText type="bold" style={{ color: "#EBDF94" }}>
                  {auth.currentUser ? "Sign Out" : "Sign In"}
                </ThemedText>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </ThemedView>
        <MyTopTen myProfileName={myProfileName} favList={user.fav_list} />
        <MyReadingGraph
          myProfileName={myProfileName}
          bookList={user.book_list}
        />
        <MyShelf myProfileName={myProfileName} bookList={user.book_list} />
      </ThemedView>
    </ScrollView>
  );
}
