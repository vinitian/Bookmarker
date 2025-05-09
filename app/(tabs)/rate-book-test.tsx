import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "react-native";
import rateBook from "@/lib/rateBook";

export default function RateBookTest() {

    const testRate = {
        book_id: "iRAfHM8w5WXih6pfZjCQ", // what girls are made of
        rating: 5.0,
        user_id: "AtpPFvSFqi5qIAABOm1G" // iannnn
    }


    return (
        <ThemedView>
            <ThemedText>HomePageTest</ThemedText>
            <Button title="test add rating"
            onPress={() => rateBook(testRate)} />
        </ThemedView>
    )
}