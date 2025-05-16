import { db } from "@/firebaseConfig";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export default function rateBook({
  book_id,
  user_id,
  rating,
}: {
  book_id: string;
  user_id: string;
  rating: number;
}) {
  const rateBook = async () => {
    try {
      const bookRef = doc(db, "books", book_id);
      const userRef = doc(db, "users", user_id);

      // 1) update for book
      const bookSnap = await getDoc(bookRef);
      const bookDoc = bookSnap.data();
      if (!bookDoc)
        throw new Error("Book with ID " + book_id + " does not exist");

      const result_book = bookDoc.rating_list.find(
        (rating: Rating) => rating.user_id === user_id
      );

      // calculate new avg_rating
      const len = bookDoc.rating_list.length;
      const new_len = result_book == null ? len + 1 : len;
      //TEST
      const rtest = [
        { user_id: "1", rating: 5 },
        { user_id: "2", rating: 3 },
        { user_id: "1", rating: 1 },
      ];
      const sum = bookDoc.rating_list.reduce(
        (sum: number, item: Rating) => sum + item.rating
      );
      const new_avg_rating =
        (sum + rating - (result_book == null ? 0 : result_book.rating)) /
        new_len;

      // update avg_rating of the book
      await updateDoc(bookRef, {
        avg_rating: new_avg_rating,
      });

      // if Rating object already exists, remove it first
      if (result_book != undefined) {
        await updateDoc(bookRef, {
          rating_list: arrayRemove({
            user_id: user_id,
            rating: result_book.rating,
          }),
        });
      }

      // add new Rating object with updated rating
      await updateDoc(bookRef, {
        rating_list: arrayUnion({
          user_id: user_id,
          rating: rating,
        }),
      });

      // ---------------------------------------------

      // 2) update for user
      const userSnap = await getDoc(userRef);
      const userDoc = userSnap.data();
      if (!userDoc)
        throw new Error("User with ID " + user_id + " does not exist");

      const result_user = userDoc.book_list.find(
        (book: PersonalBook) => book.book_id === book_id
      );

      // if PersonalBook object already exists, remove it first
      if (result_user != undefined) {
        await updateDoc(userRef, {
          book_list: arrayRemove({
            book_id: book_id,
            rating: result_user.rating,
            cumul_time: result_user.cumul_time,
            pages_read: result_user.pages_read,
            bookmark_list: result_user.bookmark_list,
          }),
        });
      }

      // add new PersonalBook object with updated rating
      // if the book wasn't added, create a new PersonalBook object with
      // initial values for cumul_time, pages_read, and bookmark_list
      await updateDoc(userRef, {
        book_list: arrayUnion({
          book_id: book_id,
          rating: rating,
          cumul_time: result_user ? result_user.cumul_time : 0,
          pages_read: result_user ? result_user.pages_read : 0,
          bookmark_list: result_user ? result_user.bookmark_list : [],
        }),
      });

      console.log("Rating updated successfully");
    } catch (err) {
      console.log("Error rating book");
      console.error(err);
    }
  };
  rateBook();
}
