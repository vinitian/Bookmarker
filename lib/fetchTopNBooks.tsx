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
    let bookList: ShortBookData[] = [];
    querySnapshot.forEach((doc) => {
      const bookData = doc.data();
      const shortBookData: ShortBookData = {
        book_id: doc.id,
        title: bookData.title,
        img_url: bookData.img_url,
        author_list: bookData.author_list,
      };
      bookList.push(shortBookData);
    });

    setTopNBooks(bookList);
  } catch (err) {
    console.log("Error fetching book data");
    console.error(err);
  }
};

export default fetchTopNBooks;
