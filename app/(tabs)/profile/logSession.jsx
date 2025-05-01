import {
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Trirong_700Bold, useFonts } from "@expo-google-fonts/trirong";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { format } from "date-fns";
import SavedBookmark from "@/components/SavedBookmark";

const AddBookmarkButton = () => (
  <TouchableOpacity
    onPress={() => {}}
    style={{
      backgroundColor: "#79AB57",
      height: 30,
      marginTop: 10,
      padding: 5,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 50,
    }}
  >
    <Text style={{ color: "#fff" }}>Add a Bookmark</Text>
  </TouchableOpacity>
);
const CustomBookView = ({ children, width, image }) => {
  if ((Platform.OS === "web") & (width > 600)) {
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
const CustomView2 = ({ children, width }) => {
  if ((Platform.OS === "web") & (width > 600)) {
    return (
      <View
        style={{
          width: "100%",
          maxWidth: 1200,
          alignSelf: "center",
          display: "flex",
          flexDirection: "row",
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

export default function logSession() {
  const image =
    "http://books.google.com/books/content?id=yQvBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api";
  const name = "An Anthology of Australian Albums";
  const authors = ["Jon Stratton", "Jon Dale", "Tony Mitchell"];
  const { height, width } = useWindowDimensions();
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
  const [startPage, setStartPage] = useState();
  const [endPage, setEndPage] = useState();

  const [fontsLoaded] = useFonts({
    Trirong_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedView
        style={{
          paddingVertical: 20,
          minHeight: height,
        }}
      >
        <CustomView2 width={width}>
          {/* Book info part */}
          <View
            style={{
              width: "fit-content",
              marginHorizontal: 10,
              alignSelf: width > 600 ? "auto" : "center",
            }}
          >
            <CustomBookView width={width} image={image}>
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
                <Text
                  style={{ color: "#79AB57", fontFamily: "Trirong_700Bold" }}
                >
                  Hours read: 00
                </Text>
                <Text
                  style={{ color: "#79AB57", fontFamily: "Trirong_700Bold" }}
                >
                  Pages read: 000
                </Text>
              </View>
            </CustomBookView>
            <AddBookmarkButton />
          </View>
          {/* Edit Bookmark & Saved Bookmarks part */}
          <View
            style={{
              marginHorizontal: 10,
              gap: 20,
              display: "flex",
              flexDirection: width < 900 ? "column" : "row",
              flexGrow: 1,
            }}
          >
            {/* Edit Bookmark */}
            <View style={{ flexGrow: 1 }}>
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
              <ThemedText
                style={{
                  marginTop: 5,
                  fontFamily: "Trirong_700Bold",
                }}
              >
                Date
              </ThemedText>
              {/* Date selector */}
              <View
                style={{
                  borderBottomWidth: 1,
                  borderColor: "#3C5433",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowDatePicker(true);
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: 5,
                    borderRadius: 50,
                  }}
                >
                  <ThemedText>
                    {selectedDate
                      ? format(selectedDate, "dd/MM/yyyy")
                      : "Not Selected"}
                  </ThemedText>
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
              <ThemedText
                style={{
                  marginTop: 5,
                  fontFamily: "Trirong_700Bold",
                }}
              >
                Time
              </ThemedText>
              {/* Time (From & To) selector */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                {/* Time (From) selector */}
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "#3C5433",
                    flexGrow: 1,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setShowStartTimePicker(true);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginLeft: 5,
                      borderRadius: 50,
                    }}
                  >
                    <ThemedText>From: {selectedStartTime}</ThemedText>
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
                    label="I start reading at..."
                  />
                </View>
                {/* Time (To) selector */}
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "#3C5433",
                    flexGrow: 1,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setShowEndTimePicker(true);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginLeft: 5,
                      borderRadius: 50,
                    }}
                  >
                    <ThemedText>To: {selectedEndTime}</ThemedText>
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
                    label="I read this until..."
                  />
                </View>
              </View>
              <ThemedText
                style={{
                  marginTop: 5,
                  fontFamily: "Trirong_700Bold",
                }}
              >
                Page
              </ThemedText>
              {/* Page (From & To) input */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                {/* Page (From) input */}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderColor: "#3C5433",
                    paddingLeft: 5,
                    flexGrow: 1,
                  }}
                >
                  <ThemedText>From: </ThemedText>
                  <TextInput
                    value={startPage}
                    onChangeText={setStartPage}
                    style={{
                      width: 100,
                      height: 24,
                      color: "#3C5433",
                      padding: 0,
                    }}
                  />
                </View>
                {/* Page (To) input */}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderColor: "#3C5433",
                    paddingLeft: 5,
                    flexGrow: 1,
                  }}
                >
                  <ThemedText>To: </ThemedText>
                  <TextInput
                    value={endPage}
                    onChangeText={setEndPage}
                    style={{
                      width: 100,
                      height: 24,
                      color: "#3C5433",
                      padding: 0,
                    }}
                  />
                </View>
              </View>
            </View>
            {/* Saved Bookmarks */}
            <View style={{ flexGrow: 1 }}>
              <ThemedText
                style={{
                  fontSize: 18,
                  lineHeight: 24,
                  marginTop: 5,
                  fontFamily: "Trirong_700Bold",
                }}
              >
                Saved Bookmarks
              </ThemedText>
              <View
                style={{
                  marginTop: 5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <SavedBookmark />
                <SavedBookmark />
                <SavedBookmark />
                <SavedBookmark />
              </View>
            </View>
          </View>
        </CustomView2>
      </ThemedView>
    </ScrollView>
  );
}
