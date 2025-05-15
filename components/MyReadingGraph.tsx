import { ThemedText } from "@/components/ThemedText";
import { View, LogBox, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { LineChart, Grid, YAxis, XAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { Dropdown } from "react-native-element-dropdown";

LogBox.ignoreLogs(["Grid"]);

const options = [
  {
    value: new Date().setDate(1),
    label: "This Month",
  },
  {
    value: new Date().setDate(0),
    label: "Last Month",
  },
];

function daysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function MyReadingGraph({
  myProfileName,
  bookList,
}: {
  myProfileName: string | undefined;
  bookList: PersonalBook[];
}) {
  const [hoursPerDay, setHoursPerDay] = useState<number[]>();

  const [option, setOption] = useState(new Date().setDate(1));

  useEffect(() => {
    const selected = new Date(option);
    let newMinutesPerDay = new Array(
      daysInMonth(selected.getMonth(), selected.getFullYear())
    ).fill(0);
    for (let book of bookList) {
      for (let bookmark of book.bookmark_list) {
        const startTime = bookmark.start_time.toDate();
        if (
          startTime.getFullYear() == selected.getFullYear() &&
          startTime.getMonth() == selected.getMonth()
        ) {
          newMinutesPerDay[startTime.getDate() - 1] += bookmark.total_time;
        }
      }
    }
    let newHoursPerDay: number[] = [];
    for (let i in newMinutesPerDay) {
      newHoursPerDay.push(newMinutesPerDay[Number(i)] / 60);
    }
    setHoursPerDay(newHoursPerDay);
  }, [bookList, option]);

  const MonthDropdown = () => (
    <Dropdown
      style={{
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#3C5433",
        minWidth: 150,
        marginHorizontal: 20,
      }}
      selectedTextStyle={styles.text}
      placeholderStyle={styles.text}
      itemTextStyle={styles.text}
      itemContainerStyle={{ borderRadius: 10 }}
      containerStyle={{
        borderRadius: 10,
        borderColor: "#3C5433",
        backgroundColor: "#F7F0DD",
      }}
      maxHeight={300}
      data={options}
      value={option}
      placeholder="This Month"
      valueField="value"
      labelField="label"
      mode="auto"
      activeColor="#eae4d3"
      onChange={(e) => {
        setOption(e.value);
      }}
    />
  );

  const LineChartComponent = ({ data }: { data: number[] }) => {
    const contentInset = { top: 20, bottom: 20 };
    return (
      <View
        style={{
          marginHorizontal: 20,
          marginBottom: 20,
          display: "flex",
          height: 250,
        }}
      >
        <ThemedText style={{ marginBottom: -10, marginLeft: -10 }}>
          Hours
        </ThemedText>
        <View style={{ flexDirection: "row", height: "100%" }}>
          <YAxis
            data={data}
            contentInset={contentInset}
            formatLabel={(value: number) => value}
            numberOfTicks={10}
            svg={{
              fill: "grey",
              fontSize: 10,
            }}
          />
          <LineChart
            style={{ flex: 1, marginLeft: 8 }}
            gridMin={0}
            gridMax={Math.max(...data)}
            data={data}
            svg={{ stroke: "#3C5433", strokeWidth: 4 }}
            contentInset={contentInset}
          >
            <Grid
              surpressError={true}
              svg={{ stroke: "#d3d3d3" }}
              direction={"HORIZONTAL"}
              belowChart={true}
              gridProps={{}}
            />
          </LineChart>
        </View>
        <XAxis
          style={{ marginLeft: 10, marginRight: -8, marginTop: -8 }}
          data={data}
          formatLabel={(value: number, index: number) =>
            index % 2 != 0 ? null : index + 1
          }
          contentInset={{ left: 10, right: 10 }}
          svg={{
            fill: "grey",
            fontSize: 10,
          }}
        />
        <ThemedText style={{ marginTop: -5, alignSelf: "center" }}>
          Date
        </ThemedText>
      </View>
    );
  };

  return (
    <View
      style={{
        width: "100%",
        maxWidth: 1200,
        alignSelf: "center",
        marginTop: 5,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          width: "100%",
        }}
      >
        <ThemedText
          type="title"
          style={{
            fontSize: 28,
            lineHeight: 48,
            paddingLeft: 15,
            marginVertical: 10,
          }}
        >
          {myProfileName == "My"
            ? "My"
            : myProfileName == undefined
            ? "Their"
            : myProfileName + "'s"}{" "}
          Reading Graph
        </ThemedText>
        <MonthDropdown />
      </View>
      {hoursPerDay ? <LineChartComponent data={hoursPerDay} /> : <></>}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Kanit_300Light",
    color: "#3C5433",
    fontSize: 16,
  },
});
