import { db } from "@/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function removeFromTopTen({
  book_id,
  user_id,
  loadUserData,
}: {
  book_id: string;
  user_id: string;
  setErrorMessage: Function;
  loadUserData: Function;
}) {
  const removeFromTopTen = async () => {
    try {
      const userRef = doc(db, "users", user_id);
      const userSnap = await getDoc(userRef);
      const userDoc = userSnap.data();

      if (!userDoc) {
        throw new Error("User with ID " + user_id + " does not exist");
      }

      const personalBook = userDoc.fav_list.find(
        (fav_book_id: string) => fav_book_id == book_id
      );

      if (!personalBook) {
        throw new Error("Can not find book info");
      }

      const new_fav_list = userDoc.fav_list.filter(
        (fav_book_id: string) => fav_book_id != book_id
      );

      await updateDoc(userRef, {
        fav_list: new_fav_list,
      });

      console.log("Removed a book from the Top Ten list");
      loadUserData();
    } catch (err) {
      console.log("Error removing book from the Top Ten list");
      // console.log(err);
    }
  };
  removeFromTopTen();
}
