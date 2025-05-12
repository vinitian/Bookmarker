import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function SavedBookmark({
  bookKey,
  setSelectedKey,
  selectedKey,
  bookmark,
  setSelectedDate,
  setStartHourMin,
  setEndHourMin,
  setStartPage,
  setEndPage,
}) {
  const [borderWidth, setBorderWidth] = useState(0);
  useEffect(() => {
    setBorderWidth(bookKey == selectedKey ? 3 : 0);
  }, [selectedKey]);

  const EditButton = () => (
    <TouchableOpacity
      onPress={() => {
        setSelectedKey(bookKey);
        setSelectedDate(new Date(bookmark.start_time.seconds * 1000));
        setStartHourMin({
          hours: new Date(bookmark.start_time.seconds * 1000)
            .getHours()
            .toString(),
          minutes: new Date(bookmark.start_time.seconds * 1000)
            .getMinutes()
            .toString(),
        });
        setEndHourMin({
          hours: new Date(bookmark.end_time.seconds * 1000)
            .getHours()
            .toString(),
          minutes: new Date(bookmark.end_time.seconds * 1000)
            .getMinutes()
            .toString(),
        });
        setStartPage(bookmark.start_page);
        setEndPage(bookmark.end_page);
      }}
      style={{
        backgroundColor: "#79AB57",
        paddingVertical: 5,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        width: "fit-content",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "bold" }}>Edit</Text>
    </TouchableOpacity>
  );
  const styles = getStyles(borderWidth);
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <ThemedText
          style={{ fontWeight: "bold", fontSize: 18, marginVertical: 5 }}
        >
          {format(new Date(bookmark.start_time.seconds * 1000), "dd/MM/yyyy")}
        </ThemedText>
        <EditButton />
      </View>
      <View style={styles.infoContainer}>
        <ThemedText>
          {new Date(bookmark.start_time.seconds * 1000)
            .getHours()
            .toString()
            .padStart(2, "0")}
          :
          {new Date(bookmark.start_time.seconds * 1000)
            .getMinutes()
            .toString()
            .padStart(2, "0")}{" "}
          -{" "}
          {new Date(bookmark.end_time.seconds * 1000)
            .getHours()
            .toString()
            .padStart(2, "0")}
          :
          {new Date(bookmark.end_time.seconds * 1000)
            .getMinutes()
            .toString()
            .padStart(2, "0")}
        </ThemedText>
        <ThemedText>{bookmark.total_time} min</ThemedText>
      </View>
      <View style={styles.infoContainer}>
        <ThemedText>
          page {bookmark.start_page} - {bookmark.end_page}
        </ThemedText>
        <ThemedText>
          {bookmark.total_page} {bookmark.total_page > 1 ? "pages" : "page"}
        </ThemedText>
      </View>
    </View>
  );
}

const getStyles = (borderWidth) =>
  StyleSheet.create({
    container: {
      backgroundColor: "#fff",
      borderRadius: 18,
      paddingHorizontal: 14 - borderWidth,
      paddingTop: 12 - borderWidth,
      paddingBottom: 8 - borderWidth,
      gap: 2,
      borderWidth: borderWidth,
      borderColor: "#79AB57",
    },
    infoContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 50,
    },
  });
