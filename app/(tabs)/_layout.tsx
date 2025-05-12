import { Link, Slot, Tabs, useRouter } from "expo-router";
import React, { createContext, useContext, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { HapticTab } from "@/components/HapticTab";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  NotoSansThaiLooped_400Regular,
  useFonts,
} from "@expo-google-fonts/noto-sans-thai-looped";
import { Trirong_700Bold } from "@expo-google-fonts/trirong";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    NotoSansThaiLooped_400Regular,
    Trirong_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

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
              href="/home"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
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
              <TouchableOpacity
                onPress={() => router.navigate("/home")}
                style={styles.webTab}
              >
                <Text style={styles.webTabText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.navigate("/search")}
                style={styles.webTab}
              >
                <Text style={styles.webTabText}>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.navigate("/profile")}
                style={styles.webTab}
              >
                <Text style={styles.webTabText}>Profile</Text>
              </TouchableOpacity>
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
        name="home"
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
      <Tabs.Screen
        name="search/book"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tab: { fontFamily: "NotoSansThaiLooped_400Regular" },
  webTab: {
    justifyContent: "center",
  },
  webTabText: {
    fontFamily: "NotoSansThaiLooped_400Regular",
    display: "flex",
    color: "#EBDF94",
    textAlignVertical: "center",
  },
});
