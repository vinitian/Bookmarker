import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TextInput,
  Platform,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useRef, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import MostPopularBooks from "@/components/MostPopularBooks";
import { ThemedView } from "@/components/ThemedView";
import { router, useLocalSearchParams } from "expo-router";
import SearchResult from "@/components/SearchResult";
import { useAppContext } from "@/app/_layout";
import { ThemedText } from "@/components/ThemedText";

const options = [
  {
    value: "alphabetical",
    label: "Alphabetical",
  },
  {
    value: "page",
    label: "Number of pages",
  },
  {
    value: "year",
    label: "Published year",
  },
  {
    value: "rating",
    label: "Rating",
  },
];

export default function SearchPage() {
  const { height, width } = useWindowDimensions();
  const query = useLocalSearchParams();
  const { queryText, setQueryText, type, setType } = useAppContext();
  useEffect(() => {
    if (Object.keys(query).length === 0) {
      setQueryText("");
      setType("title");
    } else {
      setQueryText(query.q);
      setType(query.type);
    }
  }, []);
  const [option, setOption] = useState("alphabetical");
  const [ascending, setAscending] = useState<boolean>(true);

  const [filterRating, setFilterRating] = useState<boolean>(false);
  const [filterPage, setFilterPage] = useState<boolean>(false);
  const [filterYear, setFilterYear] = useState<boolean>(false);

  const thisYear: number = new Date().getFullYear();
  const [pageMin, pageMax] = [1, 1000];
  const [yearMin, yearMax] = [1800, thisYear];
  const [ratingMin, ratingMax] = [0, 5];
  const [pageRange, setPageRange] = useState([pageMin, pageMax]);
  const [yearRange, setYearRange] = useState([yearMin, yearMax]);
  const [ratingRange, setRatingRange] = useState([ratingMin, ratingMax]);

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
      itemContainerStyle={{ borderRadius: 10 }}
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
      onChange={(e) => {
        setOption(e.value);
      }}
    />
  );
  const AscDescRadioButtons = () => {
    return (
      <>
        <Pressable
          onPress={() => {
            setAscending(true);
          }}
          style={({ pressed }: { pressed: boolean }) => ({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <MaterialCommunityIcons
            name={ascending ? "radiobox-marked" : "radiobox-blank"}
            size={24}
            color="#3C5433"
          />
          <ThemedText>Ascending</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => {
            setAscending(false);
          }}
          style={({ pressed }: { pressed: boolean }) => ({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <MaterialCommunityIcons
            name={ascending ? "radiobox-blank" : "radiobox-marked"}
            size={24}
            color="#3C5433"
          />
          <ThemedText>Descending</ThemedText>
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
          style={({ pressed }: { pressed: boolean }) => ({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            opacity: pressed ? 0.5 : 1,
          })}
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
    // set min and max values for checking
    let min = pageMin;
    let max = pageMax;
    if (text === "Published year") {
      min = yearMin;
      max = yearMax;
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
                    : setRange([range[0], +(+e.target.value).toFixed(0)]); // number of pages and published year are integers
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
                ? setRange([+(+r1).toFixed(1), +(+r2).toFixed(1)]) // ratings are rounded to 1 decimal place
                : setRange([r1, r2]); // number of pages and published year are integers
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

  const ResetButton = () => (
    //style is similar to BookmarkButton.tsx
    <Pressable
      onPress={() => {
        if (Object.keys(query).length === 0) {
          router.navigate("./search");
        } else {
          setFilterRating(false);
          setFilterPage(false);
          setFilterYear(false);
          setPageRange([pageMin, pageMax]);
          setYearRange([yearMin, yearMax]);
          setRatingRange([ratingMin, ratingMax]);
          router.navigate(`./search?title=${query.title}`);
        }
      }}
      style={({ pressed }: { pressed: boolean }) => ({
        backgroundColor: "#3C5433",
        width: 100,
        height: 32,
        marginTop: 5,
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <ThemedText
        style={{
          color: "#fff",
          fontSize: 16,
          textAlign: "center",
          marginTop: Platform.OS === "web" ? 0 : 3,
        }}
      >
        Reset
      </ThemedText>
    </Pressable>
  );

  const SortAndFilter = () => {
    const [isOpened, setIsOpened] = useState<boolean>(true);

    const rotateValue = useRef(new Animated.Value(1)).current;

    const startAnimation = () => {
      Animated.timing(rotateValue, {
        toValue: isOpened ? 0 : 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    };

    const rotateInterpolate = rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"],
    });

    return (
      <View style={{ marginHorizontal: 30, minWidth: 250 }}>
        <Pressable
          style={({ pressed }: { pressed: boolean }) => ({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            opacity: pressed ? 0.5 : 1,
          })}
          onPress={() => {
            setIsOpened(!isOpened);
            startAnimation();
          }}
        >
          <ThemedText type="subtitle" style={styles.sortFilterHeading}>
            Sort & Filter
          </ThemedText>
          <Animated.View
            style={{ transform: [{ rotateX: rotateInterpolate }] }}
          >
            <Entypo name="chevron-thin-down" size={24} color="#3C5433" />
          </Animated.View>
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
              <ThemedText type="subtitle" style={styles.sortFilter}>
                Sort by
              </ThemedText>
              <View>
                <SortDropdown />
              </View>
              <AscDescRadioButtons />
            </View>
            {/* Filter */}
            <View style={{ gap: 5 }}>
              <ThemedText type="subtitle" style={styles.sortFilter}>
                Filter by
              </ThemedText>
              <Checkbox
                text={"Number of pages"}
                option={filterPage}
                setCheckboxOption={setFilterPage}
                range={pageRange}
                setRange={setPageRange}
              />
              <Checkbox
                text={"Published year"}
                option={filterYear}
                setCheckboxOption={setFilterYear}
                range={yearRange}
                setRange={setYearRange}
              />
              <Checkbox
                text={"Rating"}
                option={filterRating}
                setCheckboxOption={setFilterRating}
                range={ratingRange}
                setRange={setRatingRange}
              />
            </View>
            <ResetButton />
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
          minHeight: 850,
        }}
      >
        <SearchBar page="search" />
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
              flex: 1,
              maxWidth: 1200,
              alignSelf: "center",
              marginTop: 20,
            }}
          >
            {
              // if no query, show most popular books
              Object.keys(query).length === 0 ? (
                <MostPopularBooks TOP_N={20} type="search" />
              ) : (
                // Pass default values
                <SearchResult
                  q={queryText}
                  type={type}
                  option={option}
                  ascending={ascending}
                  pageRange={pageRange}
                  yearRange={yearRange}
                  ratingRange={ratingRange}
                />
              )
            }
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
    fontSize: 24,
  },
  sortFilterHeading: {
    fontSize: 28,
    flexGrow: 1,
  },
  text: {
    fontFamily: "Kanit_300Light",
    color: "#3C5433",
    fontSize: 16,
  },
  textInput: {
    fontFamily: "Kanit_300Light",
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
