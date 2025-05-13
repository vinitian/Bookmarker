import { Text, Platform, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAppContext } from "@/app/_layout";

export default function BookmarkButton({ color = "#79AB57", thisBookId }) {
  const router = useRouter();
  const { bookId, setBookId } = useAppContext();

  return (
    <TouchableOpacity
      onPress={() => {
        if (thisBookId) {
          setBookId(thisBookId);
          setTimeout(() => router.push("../../../logBookmark"), 100);
        }
      }}
      style={{
        backgroundColor: color,
        width: "full",
        height: 32,
        marginTop: 5,
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontWeight: "bold",
          fontSize: 16,
          textAlign: "center",
          marginTop: Platform.OS === "web" ? 0 : -4,
        }}
      >
        Bookmark!
      </Text>
    </TouchableOpacity>
  );
}
