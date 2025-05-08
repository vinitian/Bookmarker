import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function fetchUser({ user_id, setUserData }:{user_id:string, setUserData:Function}) {

  const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", user_id);
        const docSnap = await getDoc(docRef);   
      
        // console.log(docSnap)
        // console.log(docSnap._document.data.value.mapValue.fields);
        setUserData(docSnap.data());
        
      } catch (err) {  
        console.log("error fetching user data")
        console.error(err);
      }
    }
  fetchUser()
}



    