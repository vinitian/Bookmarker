import { db } from "@/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function deleteBookmark({
  user_id,
  book_id,
  selectedKey,
  setSelectedKey,
  setErrorMessage,
  loadUserBookData,
}: {
  user_id: string;
  book_id: string;
  selectedKey: number;
  setSelectedKey: Function;
  setErrorMessage: Function;
  loadUserBookData: Function;
}) {
  const deleteBookmark = async () => {
    try {
      const userRef = doc(db, "users", user_id);
      const userSnap = await getDoc(userRef);
      const userDoc = userSnap.data();

      if (!userDoc) {
        setErrorMessage("User with ID " + user_id + " does not exist");
        throw new Error("User with ID " + user_id + " does not exist");
      }

      const personalBook = userDoc.book_list.find(
        (book: PersonalBook) => book.book_id == book_id
      );

      if (!personalBook) {
        setErrorMessage("Can not find book info");
        throw new Error("Can not find book info");
      }

      const bookmark_list = personalBook.bookmark_list;
      const new_bookmark_list = bookmark_list.filter(
        (bookmark: Bookmark, i: number) => i != selectedKey
      );
      const new_book_list = userDoc.book_list
        .filter((book: PersonalBook) => book.book_id != book_id)
        .concat([
          {
            book_id: book_id,
            rating: personalBook ? personalBook.rating : 0,
            cumul_time: personalBook
              ? personalBook.cumul_time - bookmark_list[selectedKey].total_time
              : bookmark_list[selectedKey].total_time,
            pages_read: personalBook
              ? personalBook.pages_read - bookmark_list[selectedKey].total_page
              : bookmark_list[selectedKey].total_page,
            bookmark_list: new_bookmark_list,
          },
        ]);
      await updateDoc(userRef, {
        book_list: new_book_list,
      });

      console.log("Bookmark deleted successfully");
      setErrorMessage("Bookmark deleted successfully");
      setSelectedKey(-1);
      loadUserBookData();
    } catch (err) {
      console.log("Error deleting bookmark form book_list");
      // console.error(err);
    }
  };
  deleteBookmark();
}
