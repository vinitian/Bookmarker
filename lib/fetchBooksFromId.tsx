import { db } from "@/firebaseConfig";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// For My Shelf and My Top Ten components and pages
export default function fetchBooksFromId({
  book_id_list,
  setBookDataList,
  user_id,
}: {
  book_id_list: string[];
  setBookDataList: Function;
  user_id: string;
}) {
  const fetchBooksFromId = async () => {
    try {
      const q = query(
        collection(db, "books"),
        where(documentId(), "in", book_id_list)
      );
      const docsSnap = await getDocs(q);

      if (docsSnap.empty) throw new Error("Book info not found");

      let shortBookDataList: ShortBookDataWithRating[] = [];
      docsSnap.forEach((qDocSnap) => {
        const bookData = qDocSnap.data();
        const userRating = bookData.rating_list.find(
          (item: Rating) => item.user_id === user_id
        );
        const shortBookData: ShortBookDataWithRating = {
          book_id: qDocSnap.id,
          title: bookData.title,
          img_url: bookData.img_url,
          author_list: bookData.author_list,
          user_rating: userRating ? userRating.rating : -1,
          // cannot use null or undefined since the type check in Book.tsx will fail, so we use -1 instead
        };
        shortBookDataList.push(shortBookData);
      });
      setBookDataList(shortBookDataList);
    } catch (err) {
      console.log("Error fetching book data");
      console.error(err);
    }
  };
  fetchBooksFromId();
}
