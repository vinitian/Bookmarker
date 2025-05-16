import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  useWindowDimensions,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
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
import { useLocalSearchParams } from "expo-router";

export default function logBookmark() {
  const query = useLocalSearchParams();
  const [bookId, setBookId] = useState(query.id ? query.id : "");

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
    [bookId]
  );

  const [userBookData, setUserBookData] = useState([]);
  useEffect(() => {
    loadUserBookData();
  }, [userId, bookId]);

  const loadUserBookData = () => {
    setUserBookData([]);
    if (userId && bookId) {
      fetchUserBook({
        user_id: userId,
        book_id: bookId,
        setUserBookData: setUserBookData,
      });
    }
  };

  const [selectedKey, setSelectedKey] = useState(-1); // key of editing bookmark || -1 for new bookmark

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
      <ThemedText style={styles.buttonText}>Save Bookmark</ThemedText>
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
      <ThemedText style={styles.buttonText}>Save Changes</ThemedText>
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
      <ThemedText style={styles.buttonText}>Delete Bookmark</ThemedText>
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
      <ThemedText style={styles.buttonText}>New Bookmark</ThemedText>
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
                  type="title"
                  style={{
                    fontSize: 20,
                    marginTop: 5,
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
                <ThemedText style={styles.stats}>
                  Total page:{" "}
                  <Text style={styles.statsNum}>
                    {Intl.NumberFormat("en-US").format(book.total_page)}
                  </Text>
                </ThemedText>
                <ThemedText style={styles.stats}>
                  Hours read:{" "}
                  <Text style={styles.statsNum}>
                    {userBookData?.cumul_time
                      ? Intl.NumberFormat("en-US").format(
                          (userBookData?.cumul_time / 60).toFixed(2)
                        )
                      : 0}
                  </Text>
                </ThemedText>
                <ThemedText style={styles.stats}>
                  Pages read:{" "}
                  <Text style={styles.statsNum}>
                    {userBookData?.pages_read
                      ? Intl.NumberFormat("en-US").format(
                          userBookData?.pages_read
                        )
                      : 0}
                  </Text>
                </ThemedText>
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
                type="title"
                style={{
                  fontSize: 24,
                  lineHeight: 32,
                  marginTop: 5,
                }}
              >
                {selectedKey == -1 ? "New" : "Edit"} Bookmark
              </ThemedText>
              <ThemedText style={styles.fieldHeading}>Date</ThemedText>
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
                  style={styles.dateTimePicker}
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
              <ThemedText style={styles.fieldHeading}>Time</ThemedText>
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
                    style={styles.dateTimePicker}
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
                    style={styles.dateTimePicker}
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
              <ThemedText style={styles.fieldHeading}>Page</ThemedText>
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
                    style={styles.textInput}
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
                    style={styles.textInput}
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
                      <ThemedText style={{ color: "green", lineHeight: 20 }}>
                        {errorMessage}
                      </ThemedText>
                    ) : (
                      <ThemedText style={{ color: "red", lineHeight: 20 }}>
                        {errorMessage}
                      </ThemedText>
                    )
                  ) : (
                    <ThemedText style={{ lineHeight: 20 }}></ThemedText>
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
                type="title"
                style={{
                  fontSize: 24,
                  lineHeight: 32,
                  marginTop: 5,
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
                {userBookData.bookmark_list &&
                userBookData.bookmark_list.length > 0 ? (
                  userBookData.bookmark_list.map((bookmark, i) => (
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

const styles = StyleSheet.create({
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Kanit_500Medium",
    height: 18,
    textAlign: "center",
    marginTop: Platform.OS === "web" ? 0 : 4,
  },
  stats: {
    fontFamily: "Trirong_500Medium",
    fontSize: 17,
    lineHeight: 24,
  },
  statsNum: {
    color: "#79AB57",
  },
  fieldHeading: {
    marginTop: 8,
    fontFamily: "Trirong_700Bold",
    fontSize: 18,
    lineHeight: 24,
  },
  dateTimePicker: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 5,
    borderRadius: 50,
  },
  textInput: {
    width: 100,
    height: 24,
    color: "#3C5433",
    padding: 0,
    fontFamily: "Kanit_300Light",
  },
});
