import { db } from "@/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function removeFromShelf({
  book_id,
  user_id,
  loadUserData,
}: {
  book_id: string;
  user_id: string;
  loadUserData: Function;
}) {
  const removeFromShelf = async () => {
    try {
      const userRef = doc(db, "users", user_id);
      const userSnap = await getDoc(userRef);
      const userDoc = userSnap.data();

      if (!userDoc) {
        throw new Error("User with ID " + user_id + " does not exist");
      }

      const personalBook = userDoc.book_list.find(
        (book: PersonalBook) => book.book_id == book_id
      );

      if (!personalBook) {
        throw new Error("Can not find book info");
      }

      const new_book_list = userDoc.book_list.filter(
        (book: PersonalBook) => book.book_id != book_id
      );

      await updateDoc(userRef, {
        book_list: new_book_list,
      });

      console.log("Removed a book from shelf");
      loadUserData();
    } catch (err) {
      console.log("Error removing book from the shelf");
      // console.error(err);
    }
  };
  removeFromShelf();
}
