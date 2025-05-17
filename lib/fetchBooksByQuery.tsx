import {
  collection,
  getDocs,
  getDoc,
  limit,
  orderBy,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

// converts `option` or `type` value into its respective field in books collection
const toField = (str: string) =>
  // for `option`
  str === "rating"
    ? "avg_rating"
    : str === "alphabetical"
    ? "title"
    : str === "pubYear"
    ? "published_date"
    : str === "page"
    ? "total_page"
    : // for `type`
    str === "title"
    ? "title_lowercase"
    : str === "publisher"
    ? "publisher"
    : str === "genre"
    ? "genre_list"
    : // str === "author"
      "author_list";

export const fetchBooksByQuery = async ({
  setBooks,
  type,
  q,
  option,
  ascending,
  pageRange,
  yearRange,
  ratingRange,
}: {
  setBooks: Function;
  type: string;
  q: string;
  option: string;
  ascending: boolean;
  pageRange: number[];
  yearRange: number[];
  ratingRange: number[];
}) => {
  try {
    // 1. filter then sort, because filtering is more selective
    // 2. filter avg_rating, published_date, then total_page because avg_rating is the most selective
    // https://cloud.google.com/firestore/docs/query-data/multiple-range-fields
    if (q === "") {
      // if no query, sort/filter from all books
      // limit result to 50 books
      const bookQuery = query(
        collection(db, "books"),
        where("avg_rating", ">=", ratingRange[0]),
        where("avg_rating", "<=", ratingRange[1]),
        where("published_date", ">=", new Date(yearRange[0], 0, 1)),
        where("published_date", "<=", new Date(yearRange[1] + 1, 0, 1)), // +1 to include dates after 1st january of yearRange[1]
        where("total_page", ">=", pageRange[0]),
        where("total_page", "<=", pageRange[1]),
        orderBy(toField(option), ascending ? "asc" : "desc"),
        limit(50)
      );

      const bookSnapshot = await getDocs(bookQuery);
      let bookList: ShortBookData[] = [];
      bookSnapshot.forEach((doc) => {
        const bookData = doc.data();
        const shortBookData: ShortBookData = {
          book_id: doc.id,
          title: bookData.title,
          img_url: bookData.img_url,
          author_list: bookData.author_list,
        };
        bookList.push(shortBookData);
      });

      setBooks(bookList);
    } else if (type === "isbn") {
      // get book by id, which is ISBN
      // since ISBN is unique, we use getDoc instead to fetch the book much faster

      const bookDoc = doc(db, "books", q);
      const bookSnapshot = await getDoc(bookDoc);

      if (!bookSnapshot) throw new Error("Book info not found");

      let bookList: ShortBookData[] = [];
      const bookData = bookSnapshot.data();
      if (bookData) {
        const shortBookData: ShortBookData = {
          book_id: bookSnapshot.id,
          title: bookData.title,
          img_url: bookData.img_url,
          author_list: bookData.author_list,
        };
        bookList.push(shortBookData);
      }
      setBooks(bookList ? bookList : []); // if no book is found, return an empty array
    } else {
      // explanation for the first `where` clause:
      // if type = title: where("title_lowercase", "==", q.toLowerCase()),
      // if type = publisher: where("publisher", "==", q),
      // if type = genre: where("genre_list", "array-contains", q),
      // if type = author: where("author_list", "array-contains", q),
      const bookQuery = query(
        collection(db, "books"),
        where(
          toField(type),
          type === "title" || type === "publisher" ? "==" : "array-contains",
          type === "title" ? q.toLowerCase() : q
        ),
        where("avg_rating", ">=", ratingRange[0]),
        where("avg_rating", "<=", ratingRange[1]),
        where("published_date", ">=", new Date(yearRange[0], 0, 1)),
        where("published_date", "<=", new Date(yearRange[1] + 1, 0, 1)), // +1 to include dates after 1st january of yearRange[1]
        where("total_page", ">=", pageRange[0]),
        where("total_page", "<=", pageRange[1]),
        orderBy(toField(option), ascending ? "asc" : "desc")
      );

      const bookSnapshot = await getDocs(bookQuery);
      let bookList: ShortBookData[] = [];
      bookSnapshot.forEach((doc) => {
        const bookData = doc.data();
        const shortBookData: ShortBookData = {
          book_id: doc.id,
          title: bookData.title,
          img_url: bookData.img_url,
          author_list: bookData.author_list,
        };
        bookList.push(shortBookData);
      });

      setBooks(bookList);
    }
  } catch (err) {
    console.log("Error fetching book data");
    console.error(err);
  }
};

export default fetchBooksByQuery;
