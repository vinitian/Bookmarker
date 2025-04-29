import { View, Text, Image, Platform, TouchableOpacity } from "react-native";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import React, { useState } from "react";
import BookmarkButton from "../../../components/BookmarkButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { format } from "date-fns";

export default function logSession() {
  const image =
    "http://books.google.com/books/content?id=yQvBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api";
  const name = "An Anthology of Australian Albums";
  const authors = ["Jon Stratton", "Jon Dale", "Tony Mitchell"];
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const onDatePickerConfirm = ({ date }) => {
    setShowDatePicker(false);
    setSelectedDate(date);
  };
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState("None");
  const onStartTimePickerConfirm = ({ hours, minutes }) => {
    setShowStartTimePicker(false);
    setSelectedStartTime(
      hours.toString().padStart(2, "0") +
        ":" +
        minutes.toString().padStart(2, "0")
    );
  };
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedEndTime, setSelectedEndTime] = useState("None");
  const onEndTimePickerConfirm = ({ hours, minutes }) => {
    setShowEndTimePicker(false);
    setSelectedEndTime(
      hours.toString().padStart(2, "0") +
        ":" +
        minutes.toString().padStart(2, "0")
    );
  };

  const [fontsLoaded] = useFonts({
    Trirong_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }
  const AddBookmarkButton = () => (
    <TouchableOpacity
      onPress={() => {}}
      style={{
        backgroundColor: "#79AB57",
        width: 200,
        height: 30,
        marginTop: 10,
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 50,
      }}
    >
      <Text style={{ color: "#fff" }}>Add a Bookmark</Text>
    </TouchableOpacity>
  );
  const CustomView = ({ children }) => {
    if (Platform.OS === "web") {
      return (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            width: 200,
          }}
        >
          <Image
            source={{
              uri: image,
            }}
            style={{
              width: 200,
              height: 300,
              borderRadius: 8,
            }}
          />
          {children}
        </View>
      );
    }
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
        }}
      >
        <Image
          source={{
            uri: image,
          }}
          style={{
            width: 150,
            height: 225,
            borderRadius: 8,
          }}
        />
        {children}
      </View>
    );
  };
  const CustomView2 = ({ children }) => {
    if (Platform.OS === "web") {
      return (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 5,
          }}
        >
          {children}
        </View>
      );
    }
    return (
      <View style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {children}
      </View>
    );
  };
  const DateSection = () => (
    <View>
      <ThemedText
        style={{
          marginTop: 5,
          fontFamily: "Trirong_700Bold",
        }}
      >
        Date
      </ThemedText>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "red",
        }}
      >
        <ThemedText>
          {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Not Selected"}
        </ThemedText>
        <TouchableOpacity
          onPress={() => {
            setShowDatePicker(true);
          }}
          style={{
            marginLeft: 5,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            borderRadius: 50,
          }}
        >
          <MaterialCommunityIcons
            name="calendar-today"
            size={24}
            color="#3C5433"
          />
        </TouchableOpacity>
        <DatePickerModal
          locale="en"
          mode="single"
          visible={showDatePicker}
          onDismiss={() => setShowDatePicker(false)}
          date={selectedDate}
          onConfirm={onDatePickerConfirm}
        />
      </View>
    </View>
  );

  return (
    <ThemedView style={{ paddingVertical: 20 }}>
      <CustomView2>
        <View style={{ width: "fit-content" }}>
          <CustomView>
            <View
              style={{
                maxWidth: 200,
                width: "fit-content",
              }}
            >
              <ThemedText
                style={{
                  fontSize: 18,
                  lineHeight: 24,
                  marginTop: 5,
                  fontFamily: "Trirong_700Bold",
                }}
              >
                {name}
              </ThemedText>
              <ThemedText style={{ fontSize: 14, lineHeight: 18 }}>
                by {authors[0]}{" "}
                {authors.length > 1 ? `(+${authors.length - 1})` : ``}
              </ThemedText>
              <Text style={{ color: "#79AB57", fontFamily: "Trirong_700Bold" }}>
                Hours read: 00
              </Text>
              <Text style={{ color: "#79AB57", fontFamily: "Trirong_700Bold" }}>
                Pages read: 000
              </Text>
            </View>
          </CustomView>
          <AddBookmarkButton />
        </View>
        <View
          style={{ borderWidth: 1, borderColor: "red", paddingHorizontal: 10 }}
        >
          <ThemedText
            style={{
              fontSize: 18,
              lineHeight: 24,
              marginTop: 5,
              fontFamily: "Trirong_700Bold",
            }}
          >
            Edit Bookmark
          </ThemedText>
          <DateSection />
          <ThemedText
            style={{
              marginTop: 5,
              fontFamily: "Trirong_700Bold",
            }}
          >
            Time
          </ThemedText>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              gap: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "red",
              }}
            >
              <ThemedText>From: {selectedStartTime}</ThemedText>
              <TouchableOpacity
                onPress={() => {
                  setShowStartTimePicker(true);
                }}
                style={{
                  marginLeft: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  borderRadius: 50,
                }}
              >
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={24}
                  color="#3C5433"
                />
              </TouchableOpacity>
              <TimePickerModal
                visible={showStartTimePicker}
                onDismiss={() => setShowStartTimePicker(false)}
                date={selectedStartTime}
                onConfirm={onStartTimePickerConfirm}
                use24HourClock={true}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "red",
              }}
            >
              <ThemedText>To: {selectedEndTime}</ThemedText>
              <TouchableOpacity
                onPress={() => {
                  setShowEndTimePicker(true);
                }}
                style={{
                  marginLeft: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  borderRadius: 50,
                }}
              >
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={24}
                  color="#3C5433"
                />
              </TouchableOpacity>
              <TimePickerModal
                visible={showEndTimePicker}
                onDismiss={() => setShowEndTimePicker(false)}
                date={selectedEndTime}
                onConfirm={onEndTimePickerConfirm}
                use24HourClock={true}
              />
            </View>
          </View>
        </View>
      </CustomView2>
    </ThemedView>
  );
}
