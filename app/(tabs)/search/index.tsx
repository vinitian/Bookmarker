import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  Pressable,
  TextInput,
  Platform,
} from "react-native";
import {
  NotoSansThaiLooped_400Regular,
  useFonts,
} from "@expo-google-fonts/noto-sans-thai-looped";
import { Trirong_500Medium, Trirong_700Bold } from "@expo-google-fonts/trirong";
import { Dropdown } from "react-native-element-dropdown";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import MostPopularBooks from "@/components/MostPopularBooks";
import { ThemedView } from "@/components/ThemedView";

const options = [
  {
    value: "alphabetical",
    label: "Alphabetical",
  },
  {
    value: "numPages",
    label: "Number of pages",
  },
  {
    value: "pubYear",
    label: "Published year",
  },
  {
    value: "rating",
    label: "Rating",
  },
];

export default function SearchPage() {
  const { height, width } = useWindowDimensions();

  const [option, setOption] = useState("alphabetical");
  const [isAscending, setIsAscending] = useState<boolean>(true);

  const [filterRating, setFilterRating] = useState<boolean>(false);
  const [filterNumPages, setFilterNumPages] = useState<boolean>(false);
  const [filterPubYear, setFilterPubYear] = useState<boolean>(false);

  const thisYear: number = new Date().getFullYear();
  const [numPagesMin, numPagesMax] = [1, 1000];
  const [pubYearMin, pubYearMax] = [1800, thisYear];
  const [ratingMin, ratingMax] = [0, 5];
  const [numPagesRange, setNumPagesRange] = useState([1, 2000]);
  const [pubYearRange, setPubYearRange] = useState([1800, thisYear]);
  const [ratingRange, setRatingRange] = useState([0, 5]);

  // FOR TEST
  useEffect(() => {
    console.log(
      "pg: " +
        numPagesRange.toString() +
        " | date: " +
        pubYearRange.toString() +
        " | rating: " +
        ratingRange.toString()
    );
  }, [numPagesRange, pubYearRange, ratingRange]);

  const [fontsLoaded] = useFonts({
    NotoSansThaiLooped_400Regular,
    Trirong_700Bold,
    Trirong_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const SortDropdown = () => (
    <Dropdown
      style={{
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#3C5433",
        flexGrow: 1,
        minWidth: 100,
      }}
      selectedTextStyle={styles.text}
      placeholderStyle={styles.text}
      itemTextStyle={styles.text}
      containerStyle={{
        borderRadius: 10,
        borderColor: "#3C5433",
        backgroundColor: "#F7F0DD",
      }}
      maxHeight={300}
      data={options}
      value={option}
      placeholder={""}
      valueField="value"
      labelField="label"
      mode="auto"
      activeColor="#eae4d3"
      onChange={(e) => setOption(e.value)}
    />
  );
  const AscDescRadioButtons = () => {
    return (
      <>
        <Pressable
          onPress={() => {
            setIsAscending(true);
          }}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <MaterialCommunityIcons
            name={isAscending ? "radiobox-marked" : "radiobox-blank"}
            size={24}
            color="#3C5433"
          />
          <Text style={{ color: "#3C5433" }}>Ascending</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setIsAscending(false);
          }}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <MaterialCommunityIcons
            name={isAscending ? "radiobox-blank" : "radiobox-marked"}
            size={24}
            color="#3C5433"
          />
          <Text style={{ color: "#3C5433" }}>Descending</Text>
        </Pressable>
      </>
    );
  };
  const Checkbox = ({
    text,
    option,
    setCheckboxOption,
    range,
    setRange,
  }: {
    text: string;
    option: boolean;
    setCheckboxOption: Function;
    range: number[];
    setRange: Function;
  }) => {
    return (
      <View style={{ gap: 5 }}>
        <Pressable
          onPress={() => {
            setCheckboxOption(!option);
          }}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <MaterialCommunityIcons
            name={option ? "checkbox-marked" : "checkbox-blank-outline"}
            size={24}
            color="#3C5433"
          />
          <Text style={styles.text}>{text}</Text>
        </Pressable>
        {/* Set range */}
        {option ? (
          <View style={{ width: "90%", alignSelf: "flex-end" }}>
            <Slider text={text} range={range} setRange={setRange} />
          </View>
        ) : (
          <></>
        )}
      </View>
    );
  };

  const Slider = ({
    text,
    range,
    setRange,
  }: {
    text: string;
    range: number[];
    setRange: Function;
  }) => {
    // TODO: code spaghetti... fix this
    let min = numPagesMin;
    let max = numPagesMax;
    if (text === "Published year") {
      min = pubYearMin;
      max = pubYearMax;
    } else if (text === "Rating") {
      min = ratingMin;
      max = ratingMax;
    }

    return (
      <View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/* Min value */}
          <View style={styles.textInputContainer}>
            <TextInput
              defaultValue={range[0].toString()}
              onKeyPress={(e: any) => {
                if (
                  e.nativeEvent.key === "Enter" &&
                  !isNaN(+e.target.value) && // input must be a valid number
                  +e.target.value >= min && // input must be between min and max value
                  +e.target.value <= max
                ) {
                  text === "Rating"
                    ? setRange([+(+e.target.value).toFixed(1), range[1]]) // ratings are rounded to 1 decimal place
                    : setRange([+(+e.target.value).toFixed(0), range[1]]); // number of pages and published year are integers
                }
              }}
              style={[
                styles.textInput,
                Platform.OS === "web" && ({ outlineStyle: "none" } as any),
              ]}
              keyboardType="numeric"
            />
          </View>
          {/* Max value */}
          <View style={styles.textInputContainer}>
            <TextInput
              defaultValue={range[1].toString()}
              onKeyPress={(e: any) => {
                // check if input is a valid number
                if (
                  e.nativeEvent.key === "Enter" &&
                  !isNaN(+e.target.value) && // input must be a valid number
                  +e.target.value >= min && // input must be between min and max value
                  +e.target.value <= max
                ) {
                  text === "Rating"
                    ? setRange([range[0], +(+e.target.value).toFixed(1)]) // ratings are rounded to 1 decimal place
                    : setRange([range[0], +(+e.target.value).toFixed(0)]); // number of pages and published are integers
                }
              }}
              style={[
                styles.textInput,
                Platform.OS === "web" && ({ outlineStyle: "none" } as any),
              ]}
              keyboardType="numeric"
            />
          </View>
        </View>
        <MultiSlider
          values={[range[0], range[1]]}
          sliderLength={200}
          onValuesChangeFinish={([r1, r2]) => {
            if (r1 >= min && r2 <= max) {
              text === "Rating"
                ? setRange([+(+r1).toFixed(1), +(+r2).toFixed(1)])
                : setRange([r1, r2]);
            }
          }}
          min={min}
          max={max}
          step={text === "Rating" ? 0.1 : 1}
          allowOverlap
          snapped
          containerStyle={{ alignSelf: "center", margin: -5 }}
          trackStyle={{ backgroundColor: "grey" }}
          selectedStyle={{ backgroundColor: "#3C5433", padding: 1.5 }}
          markerStyle={{
            borderWidth: 2.5,
            borderColor: "#3C5433",
            shadowRadius: 0,
            width: 20,
            height: 20,
            marginTop: 3,
            backgroundColor: "white",
          }}
        />
      </View>
    );
  };

  const SortAndFilter = () => {
    const [isOpened, setIsOpened] = useState<boolean>(true);

    return (
      <View style={{ marginHorizontal: 30, minWidth: 250 }}>
        <Pressable
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => {
            setIsOpened(!isOpened);
          }}
        >
          <Text style={styles.sortFilterHeading}>Sort & Filter</Text>
          {isOpened ? (
            <Entypo name="chevron-thin-up" size={24} color="#3C5433" />
          ) : (
            <Entypo name="chevron-thin-down" size={24} color="#3C5433" />
          )}
        </Pressable>
        {/* Horizontal line */}
        <View
          style={{
            backgroundColor: "#3C5433",
            padding: 1,
          }}
        ></View>

        {isOpened ? (
          <View
            style={{
              marginHorizontal: 20,
              marginVertical: 10,
              display: "flex",
              flexDirection: "column",
              gap: 15,
              minWidth: 150,
            }}
          >
            {/* Sort */}
            <View style={{ gap: 5 }}>
              <Text style={styles.sortFilter}>Sort by</Text>
              <View>
                <SortDropdown />
              </View>
              <AscDescRadioButtons />
            </View>
            {/* Filter */}
            <View style={{ gap: 5 }}>
              <Text style={styles.sortFilter}>Filter by</Text>
              <Checkbox
                text={"Number of pages"}
                option={filterNumPages}
                setCheckboxOption={setFilterNumPages}
                range={numPagesRange}
                setRange={setNumPagesRange}
              />
              <Checkbox
                text={"Published year"}
                option={filterPubYear}
                setCheckboxOption={setFilterPubYear}
                range={pubYearRange}
                setRange={setPubYearRange}
              />
              <Checkbox
                text={"Rating"}
                option={filterRating}
                setCheckboxOption={setFilterRating}
                range={ratingRange}
                setRange={setRatingRange}
              />
            </View>
          </View>
        ) : (
          <></>
        )}
      </View>
    );
  };

  return (
    <ScrollView>
      <ThemedView
        style={{
          paddingVertical: 50,
          paddingHorizontal: 10,
        }}
      >
        <SearchBar />
        <View
          style={{
            display: "flex",
            flexDirection: width > 600 ? "row" : "column",
          }}
        >
          {/* Sort & Filter */}
          <SortAndFilter />
          {/* Search results */}
          <View
            style={{
              display: "flex",
              flexShrink: 1,
              // flexWrap: "wrap",
              maxWidth: 1200,
              alignSelf: "center",
              marginTop: 20,
            }}
          >
            <MostPopularBooks TOP_N={20} type="search" />
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  checkbox: {
    flex: 1,
    padding: 10,
  },
  sortFilter: {
    fontFamily: "Trirong_500Medium",
    fontSize: 24,
    color: "#3C5433",
  },
  sortFilterHeading: {
    fontFamily: "Trirong_500Medium",
    fontSize: 28,
    color: "#3C5433",
    flexGrow: 1,
  },
  text: {
    color: "#3C5433",
    fontSize: 16,
  },
  textInput: {
    color: "#3C5433",
    fontSize: 16,
  },
  textInputContainer: {
    borderColor: "#3C5433",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "white",
    width: 70,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
});
