import { db } from "@/firebaseConfig";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function fetchBooksFromId({
  book_id_list,
  setBookDataList,
}: {
  book_id_list: string[];
  setBookDataList: Function;
}) {
  const fetchBooksFromId = async () => {
    try {
      const q = query(
        collection(db, "books"),
        where(documentId(), "in", book_id_list)
      );
      const docsSnap = await getDocs(q);

      if (docsSnap.empty) throw new Error("Book info not found");

      let shortBookDataList: ShortBookData[] = [];
      docsSnap.forEach((qDocSnap) => {
        const bookData = qDocSnap.data();
        const shortBookData: ShortBookData = {
          title: bookData.title,
          img_url: bookData.img_url,
          author_list: bookData.author_list,
        };
        shortBookDataList.push(shortBookData);
      });

      setBookDataList(shortBookDataList);
    } catch (err) {
      console.log("Error fetching book data");
      // console.error(err);
    }
  };
  fetchBooksFromId();
}
