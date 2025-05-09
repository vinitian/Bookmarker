import { db } from "@/firebaseConfig";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";


export default function addBookmark(
    { bookmark, user_id, book_id, errorMessage, setErrorMessage } : 
    { bookmark:Bookmark, user_id:string, book_id:string, errorMessage:string, setErrorMessage:Function  }
) {

  const addBookmark = async () => {
      try {

        console.log(bookmark)
        console.log(user_id)
        console.log(book_id)

        const userRef = doc(db, "users", user_id);
        const userSnap = await getDoc(userRef);
        const userDoc = userSnap.data();
  
        // start checks #1
        const time_now = new Date();
        if (!userDoc) {
            setErrorMessage("User with ID " + user_id + " does not exist")
            throw new Error("User with ID " + user_id + " does not exist")
        } else if (bookmark.start_time >= bookmark.end_time) {
            setErrorMessage("Start time must be before end time")
            throw new Error("Start time must be before end time")
        } else if (bookmark.start_time > time_now || bookmark.end_time > time_now ) {
            setErrorMessage("Start and end time must be in the past")
            throw new Error("Start and end time must be in the past")
        } else if (bookmark.start_page < 0 || bookmark.end_page < 0) {
            setErrorMessage("Start and end page must be greater than 0")
            throw new Error("Start and end page must be greater than 0")
        } else if (bookmark.total_page <= 0) {
            setErrorMessage("Number of pages read must be greater than 0")
            throw new Error("Number of pages read must be greater than 0")
        }
        // end checks #1

        console.log("error message now: " + errorMessage)
        console.log("passed checks #1")

        const result = userDoc.book_list.find((book: PersonalBook) => book.book_id === book_id);
        
        // if PersonalBook object already exists, remove it first
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

        // start checks #2
        if (result != undefined) {
            const check_date = result.bookmark_list.find((bm: Bookmark) => bm.start_time === bookmark.start_time)
            const check_page = result.bookmark_list.find((bm: Bookmark) => bm.start_page === bookmark.start_page)

            if (check_date?.end_time === bookmark.end_time) {
                setErrorMessage("A bookmark with the same start and end time already exists. Please either remove or edit the bookmark.")
                throw new Error("A bookmark with the same start and end time already exists. Please either remove or edit the bookmark.")
            } else if (check_page?.end_page === bookmark.end_page) {
                setErrorMessage("A bookmark with the same start and end pages already exists. Please either remove or edit the bookmark.")
                throw new Error("A bookmark with the same start and end pages already exists. Please either remove or edit the bookmark.")
            } else {
                setErrorMessage('')
            }
        } else {
            setErrorMessage('')
        }
        
        // end checks #2

        console.log("error message now: " + errorMessage)
        console.log("passed checks #2")

        if (errorMessage === '') {
            // add new PersonalBook object with updated bookmark_list
            // if the book wasn't added, create a new PersonalBook object with
            // initial values for rating, cumul_time, and pages_read
            const new_bookmark_list = result ? result.bookmark_list.append(bookmark) : [bookmark]
            await updateDoc(userRef,  {
                book_list: [{
                    book_id: book_id,
                    rating: result ? result.rating : 0,
                    cumul_time: result ? result.cumul_time : 0,
                    pages_read: result ? result.pages_read : 0 ,
                    bookmark_list: new_bookmark_list
                }]
            })
            
            console.log("Bookmark updated successfully")
            setErrorMessage(undefined)
        }  
      } catch (err) {  
        console.log("Error adding bookmark");
        console.error(err);
      }
    }
  addBookmark()
}
    