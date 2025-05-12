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
import { useAppContext } from "@/app/_layout";
import { useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { format } from "date-fns";
import fetchBook from "@/lib/fetchBook.tsx";
import SavedBookmark from "@/components/SavedBookmark";
import addBookmark from "@/lib/addBookmark.tsx";
import saveBookmarkChanges from "@/lib/saveBookmarkChanges.tsx";
import deleteBookmark from "@/lib/deleteBookmark.tsx";
import { fetchUserBook } from "@/lib/fetchUser";
import CustomBookView from "@/components/CustomBookView";
import CustomView2 from "@/components/CustomView2";

export default function logBookmark() {
  const { bookId, setBookId } = useAppContext();
  const [book, setBookData] = useState(undefined);
  useEffect(() => {
    if (bookId) {
      fetchBook({ book_id: bookId, setBookData: setBookData });
    }
  }, [bookId]);

  const { height, width } = useWindowDimensions();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const onDatePickerConfirm = ({ date }) => {
    setShowDatePicker(false);
    setSelectedDate(date);
  };
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState();
  const onStartTimePickerConfirm = ({ hours, minutes }) => {
    setShowStartTimePicker(false);
    setSelectedStartTime(
      hours.toString().padStart(2, "0") +
        ":" +
        minutes.toString().padStart(2, "0")
    );
  };
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedEndTime, setSelectedEndTime] = useState();
  const onEndTimePickerConfirm = ({ hours, minutes }) => {
    setShowEndTimePicker(false);
    setSelectedEndTime(
      hours.toString().padStart(2, "0") +
        ":" +
        minutes.toString().padStart(2, "0")
    );
  };
  const dateWithHourMin = (date, time) => {
    if (!date || !time) return;
    let newDate = new Date(date.setHours(Number(time.slice(0, 2))));
    newDate = new Date(newDate.setMinutes(Number(time.slice(3, 5))));
    newDate = new Date(newDate.setSeconds(0));
    return newDate;
  };
  const [startPage, setStartPage] = useState();
  const [endPage, setEndPage] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  const [userId, setUserId] = useState();
  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
        }
      }),
    []
  );

  const [userBookData, setUserBookData] = useState();
  useEffect(() => {
    loadUserBookData();
  }, [userId, bookId]);

  const [refreshing, setRefreshing] = useState(true);
  const loadUserBookData = () => {
    if (userId && bookId) {
      fetchUserBook({
        user_id: userId,
        book_id: bookId,
        setUserBookData: setUserBookData,
      });
      setRefreshing(false);
    }
  };

  const [selectedKey, setSelectedKey] = useState(-1); // key of editing bookmark || -1 for new bookmark

  const [fontsLoaded] = useFonts({
    Trirong_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }

  const SaveBookmarkButton = () => (
    <TouchableOpacity
      onPress={() => {
        addBookmark({
          bookmark: {
            start_time: dateWithHourMin(selectedDate, selectedStartTime),
            end_time: dateWithHourMin(selectedDate, selectedEndTime),
            total_time: Math.round(
              (dateWithHourMin(selectedDate, selectedEndTime) -
                dateWithHourMin(selectedDate, selectedStartTime)) /
                60 /
                1000
            ),
            start_page: startPage,
            end_page: endPage,
            total_page: endPage - startPage,
          },
          user_id: userId,
          book_id: bookId,
          errorMessage: errorMessage,
          setErrorMessage: setErrorMessage,
          loadUserBookData: loadUserBookData,
        });
        setTimeout(() => setErrorMessage(""), 6000);
      }}
      style={{
        backgroundColor: "#79AB57",
        height: 30,
        marginTop: 10,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        display: "flex",
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
        Save Bookmark
      </Text>
    </TouchableOpacity>
  );
  const SaveChangeButton = () => (
    <TouchableOpacity
      onPress={() => {
        saveBookmarkChanges({
          bookmark: {
            start_time: dateWithHourMin(selectedDate, selectedStartTime),
            end_time: dateWithHourMin(selectedDate, selectedEndTime),
            total_time: Math.round(
              (dateWithHourMin(selectedDate, selectedEndTime) -
                dateWithHourMin(selectedDate, selectedStartTime)) /
                60 /
                1000
            ),
            start_page: startPage,
            end_page: endPage,
            total_page: endPage - startPage,
          },
          user_id: userId,
          book_id: bookId,
          selectedKey: selectedKey,
          errorMessage: errorMessage,
          setErrorMessage: setErrorMessage,
          loadUserBookData: loadUserBookData,
        });
        setTimeout(() => setErrorMessage(""), 6000);
      }}
      style={{
        backgroundColor: "#79AB57",
        height: 30,
        marginTop: 10,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        display: "flex",
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
        Save Changes
      </Text>
    </TouchableOpacity>
  );
  const DeleteBookmarkButton = () => (
    <TouchableOpacity
      onPress={() => {
        setErrorMessage("");
        deleteBookmark({
          user_id: userId,
          book_id: bookId,
          selectedKey: selectedKey,
          setSelectedKey: setSelectedKey,
          setErrorMessage: setErrorMessage,
          loadUserBookData: loadUserBookData,
        });
        setTimeout(() => setErrorMessage(""), 6000);
      }}
      style={{
        backgroundColor: "#F28A8A",
        height: 30,
        marginTop: 10,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        display: "flex",
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
        Delete Bookmark
      </Text>
    </TouchableOpacity>
  );
  const NewBookmarkButton = () => (
    <TouchableOpacity
      onPress={() => {
        setSelectedKey(-1);
      }}
      style={{
        backgroundColor: "#3C5433",
        height: 30,
        marginTop: 10,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        display: "flex",
      }}
    >
      <Text
        style={{
          color: "#F7F0DD",
          fontWeight: "bold",
          fontSize: 18,
          height: 24,
        }}
      >
        New Bookmark
      </Text>
    </TouchableOpacity>
  );

  return book ? (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedView
        style={{
          paddingVertical: 20,
          paddingHorizontal: 10,
          minHeight: height,
        }}
      >
        <CustomView2 width={width} book={book}>
          {/* Book info part */}
          <View
            style={{
              width: "fit-content",
              marginHorizontal: 10,
              alignSelf: width > 600 ? "auto" : "center",
            }}
          >
            <CustomBookView width={width} image={book.img_url} book={book}>
              <View
                style={{
                  maxWidth: 200,
                  width: "fit-content",
                }}
              >
                <ThemedText
                  style={{
                    fontSize: 20,
                    lineHeight: 26,
                    marginTop: 5,
                    fontFamily: "Trirong_700Bold",
                  }}
                >
                  {book.title}
                </ThemedText>
                <ThemedText
                  style={{ fontSize: 14, lineHeight: 18, marginBottom: 5 }}
                >
                  by {book.author_list[0]}{" "}
                  {book.author_list.length > 1
                    ? `(+${book.author_list.length - 1})`
                    : ``}
                </ThemedText>
                <Text
                  style={{
                    color: "#79AB57",
                    fontFamily: "Trirong_700Bold",
                    fontSize: 17,
                    lineHeight: 24,
                  }}
                >
                  Hours read:{" "}
                  {userBookData?.cumul_time ? userBookData?.cumul_time / 60 : 0}
                </Text>
                <Text
                  style={{
                    color: "#79AB57",
                    fontFamily: "Trirong_700Bold",
                    fontSize: 17,
                    lineHeight: 24,
                  }}
                >
                  Pages read: {userBookData?.pages_read ?? 0}
                </Text>
              </View>
            </CustomBookView>
            {selectedKey == -1 ? (
              <View style={{ height: 40 }} />
            ) : (
              <NewBookmarkButton />
            )}
          </View>
          {/* Edit Bookmark & Saved Bookmarks part */}
          <View
            style={{
              marginHorizontal: 10,
              gap: 10,
              display: "flex",
              flexDirection: width < 900 ? "column" : "row",
              flexGrow: 1,
            }}
          >
            {/* Edit Bookmark */}
            <View style={{ flexGrow: 1 }}>
              <ThemedText
                style={{
                  fontSize: 24,
                  lineHeight: 32,
                  marginTop: 5,
                  fontFamily: "Trirong_700Bold",
                }}
              >
                {selectedKey == -1 ? "New" : "Edit"} Bookmark
              </ThemedText>
              <ThemedText
                style={{
                  marginTop: 8,
                  fontFamily: "Trirong_700Bold",
                  fontSize: 18,
                  lineHeight: 24,
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
                  marginTop: 8,
                  fontFamily: "Trirong_700Bold",
                  fontSize: 18,
                  lineHeight: 24,
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
                    label="I started reading at..."
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
                  marginTop: 8,
                  fontFamily: "Trirong_700Bold",
                  fontSize: 18,
                  lineHeight: 24,
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
              <View
                style={{
                  width:
                    width > 600
                      ? width < 900
                        ? 0.4 * width
                        : 0.3 * width
                      : "auto",
                }}
              >
                {
                  errorMessage ? (
                    errorMessage == "Bookmark updated successfully" ||
                    errorMessage == "Bookmark deleted successfully" ? (
                      <Text style={{ color: "green", lineHeight: 20 }}>
                        {errorMessage}
                      </Text>
                    ) : (
                      <Text style={{ color: "red", lineHeight: 20 }}>
                        {errorMessage}
                      </Text>
                    )
                  ) : (
                    <Text style={{ lineHeight: 20 }}></Text>
                  ) // empty text
                }
              </View>

              {selectedKey == -1 ? (
                <SaveBookmarkButton />
              ) : (
                <>
                  <SaveChangeButton />
                  <DeleteBookmarkButton />
                </>
              )}
            </View>
            {/* Saved Bookmarks */}
            <View style={{ flexGrow: 1 }}>
              <ThemedText
                style={{
                  fontSize: 24,
                  lineHeight: 32,
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
                  flexDirection: "column-reverse",
                  gap: 10,
                }}
              >
                {userBookData?.bookmark_list.length > 0 ? (
                  userBookData?.bookmark_list.map((bookmark, i) => (
                    <SavedBookmark
                      key={i}
                      bookKey={i}
                      setSelectedKey={setSelectedKey}
                      selectedKey={selectedKey}
                      bookmark={bookmark}
                      setSelectedDate={setSelectedDate}
                      setStartHourMin={onStartTimePickerConfirm}
                      setEndHourMin={onEndTimePickerConfirm}
                      setStartPage={setStartPage}
                      setEndPage={setEndPage}
                    />
                  ))
                ) : (
                  <ThemedText>No bookmark yet</ThemedText>
                )}
              </View>
            </View>
          </View>
        </CustomView2>
      </ThemedView>
    </ScrollView>
  ) : (
    <></>
  );
}
