import { Link, Slot, Tabs, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, Pressable, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppContext } from "../_layout";

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { queryText, setQueryText, type, setType } = useAppContext();

  if (Platform.OS === "web") {
    return (
      <>
        <View style={{ backgroundColor: "#3C5433" }}>
          <View
            style={{
              width: "100%",
              maxWidth: 1200,
              alignSelf: "center",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 4,
              paddingRight: 20,
              paddingLeft: 10,
            }}
          >
            <Link
              href="../../"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
              onPress={() => {
                setQueryText("");
                setType("title");
              }}
            >
              <MaterialIcons name="bookmark" size={22} color="#EBDF94" />
              <Text
                style={{
                  fontFamily: "Trirong_700Bold",
                  fontSize: 22,
                  color: "#EBDF94",
                }}
              >
                Bookmarker
              </Text>
            </Link>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
                gap: 16,
              }}
            >
              <Pressable
                onPress={() => {
                  router.navigate("../../");
                  setQueryText("");
                  setType("title");
                }}
                style={({ pressed }) => [
                  styles.webTab || {},
                  { opacity: pressed ? 0.5 : 1 },
                ]}
              >
                <Text style={styles.webTabText}>Home</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setQueryText("");
                  setType("title");
                  router.navigate("../../search");
                }}
                style={({ pressed }) => [
                  styles.webTab || {},
                  { opacity: pressed ? 0.5 : 1 },
                ]}
              >
                <Text style={styles.webTabText}>Search</Text>
              </Pressable>
              <Pressable
                onPress={() => router.navigate("../../profile")}
                style={({ pressed }) => [
                  styles.webTab || {},
                  { opacity: pressed ? 0.5 : 1 },
                ]}
              >
                <Text style={styles.webTabText}>Profile</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <Slot />
      </>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle: styles.tab,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: "#EBDF94",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {
            backgroundColor: "#3C5433",
            paddingTop: 4,
            height: 60,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search/index"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name="magnifying-glass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name="user-large" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tab: { fontFamily: "Kanit_300Light" },
  webTab: {
    justifyContent: "center",
  },
  webTabText: {
    fontFamily: "Kanit_300Light",
    display: "flex",
    color: "#EBDF94",
    textAlignVertical: "center",
  },
});
