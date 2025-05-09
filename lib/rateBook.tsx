import { db } from "@/firebaseConfig";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
 
export default function rateBook(
    { book_id, user_id, rating } : 
    { book_id:string, user_id:string, rating:number }
) {

  const rateBook = async () => {
      try {
        const userRef = doc(db, "users", user_id);
        const bookRef = doc(db, "books", book_id);

        // 1) update  for book
        // remove previous rating
        const resultremove = await updateDoc(bookRef, {
            rating: arrayRemove({
                user_id: user_id,
                rating,
             })
        });

        // add new rating
        const resultunion = await updateDoc(bookRef, {
            rating: arrayUnion({
                user_id: user_id,
                rating: rating,
             })
        });

        // -----------------------
        
        // 2) update for user
        const userSnap = await getDoc(userRef);
        const userDoc = userSnap.data();
        if (!userDoc)
            throw new Error("User with ID " + user_id + " does not exist")

        let result = userDoc.book_list.find((book: PersonalBook) => book.book_id === book_id);
        
        // if PersonalBook object already exists
        if (result != undefined) {
            await updateDoc(userRef, {
                book_list: arrayRemove({
                    book_id: book_id,
                    rating: result.rating ,
                    cumul_time: result.cumul_time,
                    pages_read: result.pages_read,
                    bookmark_list: result.bookmark_list
                })
            })
        }

        // add new PersonalBook object with updated rating
        // if the book wasn't added, create a new PersonalBook object with
        // initial values for cumul_time, pages_read, and reading_sesssions
        const response = await updateDoc(userRef,  {
            "book_list": [
                {
                    book_id: book_id,
                    rating: rating,
                    cumul_time: result ? result.cumul_time : 0,
                    pages_read: result ? result.pages_read : 0 ,
                    bookmark_list: result ? result.bookmark_list : []
                }
            ]
        })
        
        console.log("Rating updated successfully")
        
      } catch (err) {  
        console.log("Error rating book");
        console.error(err);
      }
    }
  rateBook()
}



    