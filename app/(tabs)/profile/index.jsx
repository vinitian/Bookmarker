import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import UserInfo from "@/components/UserInfo";
import MyTopTen from "@/components/MyTopTen";
import MyShelf from "@/components/MyShelf";

export default function HomeScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedView style={{ paddingBottom: 20 }}>
        <ThemedText>Profile Page</ThemedText>
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
              maxWidth: 1100,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <UserInfo
              username="Usernameeee"
              email="email@gmail.com"
              image="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            />
            <TouchableOpacity
              onPress={() => {}}
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
              <Text style={{ color: "#EBDF94" }}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ThemedView>
        <MyTopTen />
        <MyShelf />
      </ThemedView>
    </ScrollView>
  );
}
