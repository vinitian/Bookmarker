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
      const personalBook = userDoc?.book_list.find(
        (book: PersonalBook) => book.book_id == book_id
      );
      const bookmarkList = personalBook.bookmark_list;
      const newBookmarkList = bookmarkList.filter(
        (bookmark: Bookmark, i: number) => i != selectedKey
      );
      await updateDoc(userRef, {
        book_list: [
          {
            book_id: book_id,
            rating: personalBook ? personalBook.rating : 0,
            cumul_time: personalBook
              ? personalBook.cumul_time - bookmarkList[selectedKey].total_time
              : bookmarkList[selectedKey].total_time,
            pages_read: personalBook
              ? personalBook.pages_read - bookmarkList[selectedKey].total_page
              : bookmarkList[selectedKey].total_page,
            bookmark_list: newBookmarkList,
          },
        ],
      });

      console.log("Bookmark deleted successfully");
      setErrorMessage("Bookmark deleted successfully");
      setSelectedKey(-1);
      loadUserBookData();
    } catch (err) {
      console.log("Error deleting bookmark form book_list");
      console.log(err);
    }
  };
  deleteBookmark();
}
