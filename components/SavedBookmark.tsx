import { View, Pressable, StyleSheet, Platform } from "react-native";
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
}: {
  bookKey: number;
  setSelectedKey: Function;
  selectedKey: number;
  bookmark: any;
  setSelectedDate: Function;
  setStartHourMin: Function;
  setEndHourMin: Function;
  setStartPage: Function;
  setEndPage: Function;
}) {
  const [borderWidth, setBorderWidth] = useState(0);
  useEffect(() => {
    setBorderWidth(bookKey == selectedKey ? 3 : 0);
  }, [selectedKey]);

  const EditButton = () => (
    <Pressable
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
      }}
    >
      <ThemedText
        type="bold"
        style={{ color: "#fff", marginTop: Platform.OS === "web" ? 0 : 4 }}
      >
        Edit
      </ThemedText>
    </Pressable>
  );
  const styles = getStyles(borderWidth);
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <ThemedText type="bold" style={{ fontSize: 18, marginVertical: 5 }}>
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
        <ThemedText>
          {Intl.NumberFormat("en-US").format(bookmark.total_time)} min
        </ThemedText>
      </View>
      <View style={styles.infoContainer}>
        <ThemedText>
          page {Intl.NumberFormat("en-US").format(bookmark.start_page)} -{" "}
          {Intl.NumberFormat("en-US").format(bookmark.end_page)}
        </ThemedText>
        <ThemedText>
          {Intl.NumberFormat("en-US").format(bookmark.total_page)}{" "}
          {bookmark.total_page > 1 ? "pages" : "page"}
        </ThemedText>
      </View>
    </View>
  );
}

const getStyles = (borderWidth: number) =>
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
