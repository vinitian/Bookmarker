import { db } from "@/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function saveBookmarkChanges({
  bookmark,
  user_id,
  book_id,
  selectedKey,
  errorMessage,
  setErrorMessage,
  loadUserBookData,
}: {
  bookmark: Bookmark;
  user_id: string;
  book_id: string;
  selectedKey: number;
  errorMessage: string;
  setErrorMessage: Function;
  loadUserBookData: Function;
}) {
  const saveBookmarkChanges = async () => {
    try {
      const userRef = doc(db, "users", user_id);
      const userSnap = await getDoc(userRef);
      const userDoc = userSnap.data();

      const bookRef = doc(db, "books", book_id);
      const bookSnap = await getDoc(bookRef);
      const bookDoc = bookSnap.data();

      // start checks #1
      const time_now = new Date();
      if (!userDoc) {
        setErrorMessage("User with ID " + user_id + " does not exist");
        throw new Error("User with ID " + user_id + " does not exist");
      } else if (!bookDoc) {
        setErrorMessage("Book with ID " + book_id + " does not exist");
        throw new Error("Book with ID " + book_id + " does not exist");
      } else if (!bookmark.start_time || !bookmark.end_time) {
        setErrorMessage("Missing time input");
        throw new Error("Missing time input");
      } else if (bookmark.start_time >= bookmark.end_time) {
        setErrorMessage("Start time must be before end time");
        throw new Error("Start time must be before end time");
      } else if (
        bookmark.start_time > time_now ||
        bookmark.end_time > time_now
      ) {
        setErrorMessage("Start and end time must be in the past");
        throw new Error("Start and end time must be in the past");
      } else if (bookmark.start_page < 0 || bookmark.end_page < 0) {
        setErrorMessage("Start and end page must be greater than 0");
        throw new Error("Start and end page must be greater than 0");
      } else if (bookmark.total_page <= 0) {
        setErrorMessage("Number of pages read must be greater than 0");
        throw new Error("Number of pages read must be greater than 0");
      } else if (bookmark.end_page > bookDoc.total_page) {
        setErrorMessage(
          "End page number read must not exceed book's total number of pages"
        );
        throw new Error(
          "End page number read must not exceed book's total number of pages"
        );
      } else {
        setErrorMessage("");
      }
      // end checks #1

      const result = userDoc.book_list.find(
        (book: PersonalBook) => book.book_id === book_id
      );

      const excluded_bookmark_list = result.bookmark_list.filter(
        (bm: Bookmark, i: number) => i != selectedKey
      );
      let original_bookmark = result.bookmark_list.find(
        (bm: Bookmark, i: number) => i == selectedKey
      );

      // Check if the bookmark info changed
      if (
        bookmark.start_time.getTime() / 1000 ==
          original_bookmark.start_time.seconds &&
        bookmark.end_time.getTime() / 1000 ==
          original_bookmark.end_time.seconds &&
        bookmark.total_time == original_bookmark.total_time &&
        bookmark.start_page == original_bookmark.start_page &&
        bookmark.end_page == original_bookmark.end_page &&
        bookmark.total_page == original_bookmark.total_page
      ) {
        setErrorMessage("There's no change to the bookmark");
        throw new Error("There's no change to the bookmark");
      }

      const toSec = (date: Date) => {
        return Math.floor(date.getTime() / 1000);
      };

      // start checks #2
      if (result != undefined) {
        const check_start_time = excluded_bookmark_list.find(
          (bm: Bookmark) => bm.start_time === bookmark.start_time
        );
        const check_end_time = excluded_bookmark_list.find(
          (bm: Bookmark) => bm.end_time === bookmark.end_time
        );
        const check_page = result.bookmark_list.find(
          (bm: Bookmark) =>
            bm.start_page === bookmark.start_page ||
            bm.start_page === bookmark.end_page ||
            bm.end_page === bookmark.start_page ||
            bm.end_page === bookmark.end_page
        );
        const check_time_overlap = excluded_bookmark_list.find(
          (bm: any) =>
            (bm.start_time.seconds > toSec(bookmark.start_time) &&
              bm.start_time.seconds < toSec(bookmark.end_time)) ||
            (bm.end_time.seconds > toSec(bookmark.start_time) &&
              bm.end_time.seconds < toSec(bookmark.start_time))
        );

        if (check_start_time || check_end_time) {
          setErrorMessage(
            "A bookmark with the same start or end time already exists. Please either remove or edit the bookmark."
          );
          throw new Error(
            "A bookmark with the same start or end time already exists. Please either remove or edit the bookmark."
          );
        } else if (check_page) {
          setErrorMessage(
            "A bookmark with the same start or end page already exists. Please either remove or edit the bookmark."
          );
          throw new Error(
            "A bookmark with the same start or end page already exists. Please either remove or edit the bookmark."
          );
        } else if (check_time_overlap) {
          setErrorMessage(
            "A bookmark with overlapping duration already exists. Please either remove or edit the bookmark."
          );
          throw new Error(
            "A bookmark with overlapping duration already exists. Please either remove or edit the bookmark."
          );
        } else {
          setErrorMessage("");
        }
      } else {
        setErrorMessage("Can not find book info");
        throw new Error("Can not find book info");
      }
      // end checks #2

      if (!errorMessage) {
        // add new PersonalBook object with updated bookmark_list
        // if the book wasn't added, create a new PersonalBook object
        // arrayUnion() is not currently supported inside arrays, `push` is used instead
        const new_bookmark_list = excluded_bookmark_list.concat([bookmark]);
        const new_book_list = userDoc.book_list
          .filter((book: PersonalBook) => book.book_id != book_id)
          .concat([
            {
              book_id: book_id,
              rating: result.rating,
              cumul_time:
                result.cumul_time -
                original_bookmark.total_time +
                bookmark.total_time,
              pages_read:
                result.pages_read -
                original_bookmark.total_page +
                bookmark.total_page,
              bookmark_list: new_bookmark_list,
            },
          ]);

        await updateDoc(userRef, {
          book_list: new_book_list,
        });

        console.log("Bookmark updated successfully");
        setErrorMessage("Bookmark updated successfully");
        loadUserBookData();
      }
    } catch (err) {
      console.log("Error adding bookmark");
      //   console.error(err);
    }
  };
  saveBookmarkChanges();
}
