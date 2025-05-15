import { useState } from "react";
import { TextInput, View, Pressable, Platform, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useAppContext } from "@/app/_layout";

const types = [
  {
    value: "title",
    label: "Title",
  },
  {
    value: "author",
    label: "Author",
  },
  {
    value: "publisher",
    label: "Publisher",
  },
  {
    value: "isbn",
    label: "ISBN",
  },
  {
    value: "genre",
    label: "Genre",
  },
];
export const SearchBar = ({ page }: { page: string }) => {
  const query = useLocalSearchParams<{ type: string; q: string }>();
  const router = useRouter();
  const { queryText, setQueryText, type, setType } = useAppContext();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleKeyDown = (e: any) => {
    if (e.nativeEvent.key === "Enter") {
      setQueryText(e.target.value);
      queryText === ""
        ? router.navigate("./search")
        : router.navigate(`./search?type=${type}&q=${queryText}`);
    }
  };

  return (
    <Pressable
      onHoverIn={() => setIsFocused(true)}
      onHoverOut={() => setIsFocused(false)}
      style={{
        height: 50,
        width: "90%", //TEST
        maxWidth: 600,
        minWidth: 300,
        marginVertical: 12,
        alignSelf: "center",
      }}
    >
      <View
        style={{
          height: "100%",
          borderWidth: isFocused ? 2 : 0,
          borderColor: "#3C5433",
          paddingHorizontal: 10,
          borderRadius: 50,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "white",
        }}
      >
        <TextInput
          value={queryText}
          onChangeText={(text) => setQueryText(text)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search..."
          placeholderTextColor="#8b8b8b"
          returnKeyType="search"
          onKeyPress={handleKeyDown}
          style={[
            styles.textInput,
            Platform.OS === "web" && ({ outlineStyle: "none" } as any),
          ]}
        />
        {/* Select field to search & search button */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          {/* Vertical bar */}
          <View
            style={{
              backgroundColor: "#3C5433",
              paddingVertical: 15,
              paddingHorizontal: 0.5,
            }}
          />
          <Dropdown
            style={{ width: 100 }}
            selectedTextStyle={{ marginLeft: 8 }}
            containerStyle={{ borderRadius: 10 }}
            itemContainerStyle={{ borderRadius: 10 }}
            fontFamily="Kanit_300Light"
            maxHeight={400}
            showsVerticalScrollIndicator={false}
            value={type}
            data={types}
            valueField="value"
            labelField="label"
            mode="auto"
            activeColor="#ededed"
            onChange={(e) => setType(e.value)}
          />
          <Pressable
            onPress={() => {
              if (page === "home") {
                router.navigate(`./search?type=${type}&q=${queryText}`);
              } else if (page === "search") {
                queryText === ""
                  ? router.navigate("./search")
                  : router.navigate(`./search?type=${type}&q=${queryText}`);
              }
            }}
            style={{ marginTop: Platform.OS === "web" ? 0 : -5 }}
          >
            <EvilIcons name="search" size={28} color="#3C5433" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};
export default SearchBar;

const styles = StyleSheet.create({
  textInput: {
    fontFamily: "Kanit_300Light",
    flexGrow: 1,
    flexShrink: 1,
    width: "80%",
    minWidth: 50,
    marginHorizontal: 10,
    marginVertical: Platform.OS === "web" ? 10 : 0,
  },
});
