import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export const fetchTopNBooks = async ({
  n,
  setTopNBooks,
}: {
  n: number;
  setTopNBooks: Function;
}) => {
  try {
    const bookQuery = query(
      collection(db, "books"),
      orderBy("rating_list", "desc"),
      orderBy("avg_rating", "desc"),
      limit(n)
    );
    const querySnapshot = await getDocs(bookQuery);
    let bookList: any[] = [];
    querySnapshot.forEach((doc) => {
      bookList.push({ id: doc.id, data: doc.data() });
      setTopNBooks(bookList);
    });
  } catch (err) {
    console.log("Error fetching book data");
    console.error(err);
  }
};

export default fetchTopNBooks;
