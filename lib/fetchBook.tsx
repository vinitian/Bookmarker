import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function fetchBook({ book_id, setBookData }:{book_id:string, setBookData:Function}) {

  const fetchBook = async () => {
      try {
        const docRef = doc(db, "books", book_id);
        const docSnap = await getDoc(docRef);   
      
        setBookData(docSnap.data());
        
      } catch (err) {  
        console.log("Error fetching book data")
        console.error(err);
      }
    }
  fetchBook()
}



    