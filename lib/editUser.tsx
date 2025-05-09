import { db } from "@/firebaseConfig";
import { Auth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export function createUser({auth, name} : {auth: Auth, name:string}) {
  setDoc(
    doc(db, "users", auth.currentUser!.uid),
    {
      email: auth.currentUser!.email,
      name: name,
      book_list: [],
      fav_list: []
    },
    { merge: true }
  );
}
