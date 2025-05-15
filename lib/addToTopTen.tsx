import { db } from "@/firebaseConfig";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";

export default function addToTopTen({
  book_id,
  user_id,
}: {
  book_id: string;
  user_id: string;
}) {
  const addToTopTen = async () => {
    try {
      const bookRef = doc(db, "books", book_id);
      const userRef = doc(db, "users", user_id);

      // check if book exists in database
      const bookSnap = await getDoc(bookRef);
      const bookDoc = bookSnap.data();
      if (!bookDoc)
        throw new Error("Book with ID " + book_id + " does not exist");

      const userSnap = await getDoc(userRef);
      const userDoc = userSnap.data();
      if (!userDoc)
        throw new Error("User with ID " + user_id + " does not exist");

      // if book does not exist in My Shelf (book_list), add it to there first
      const check_myshelf = userDoc.book_list.find(
        (book: PersonalBook) => book.book_id === book_id
      );
      if (!check_myshelf) {
        await updateDoc(userRef, {
          book_list: arrayUnion({
            book_id: book_id,
            rating: 0,
            cumul_time: 0,
            pages_read: 0,
            bookmark_list: [],
          }),
        });
      }

      const cut_list = userDoc.fav_list.filter(
        (fav_book_id: string, i: number) => i <= 8
      );

      // add book_id to My Top Ten list (fav_list)
      await updateDoc(userRef, {
        fav_list: [book_id, ...cut_list],
      });

      console.log("Book added to my Top Ten successfully");
    } catch (err) {
      console.log("Error adding book to Top Ten");
      console.error(err);
    }
  };
  addToTopTen();
}
