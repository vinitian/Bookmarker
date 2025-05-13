import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function fetchUser({
  user_id,
  setUserData,
}: {
  user_id: string;
  setUserData: Function;
}) {
  const fetchUser = async () => {
    try {
      const docRef = doc(db, "users", user_id);
      const docSnap = await getDoc(docRef);

      setUserData(docSnap.data());
    } catch (err) {
      console.log("Error fetching user data");
      console.error(err);
    }
  };
  fetchUser();
}

export function fetchUserBook({
  user_id,
  book_id,
  setUserBookData,
}: {
  user_id: string;
  book_id: string;
  setUserBookData: Function;
}) {
  const fetchUserBook = async () => {
    try {
      const docRef = doc(db, "users", user_id);
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data();
      const bookList = docData?.book_list;
      const wantedBook = bookList.find(
        (book: PersonalBook) => book.book_id == book_id
      );

      if (wantedBook == undefined)
        throw new Error("Book ID not in user's book_list");
      setUserBookData(wantedBook);
    } catch (err) {
      console.log("Error fetching user book data");
      // console.error(err);
    }
  };
  fetchUserBook();
}
