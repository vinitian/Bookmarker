import { db } from "@/firebaseConfig";
import { Auth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export function createUser(auth: Auth) {
  setDoc(
    doc(db, "users", auth.currentUser!.uid),
    {
      email: auth.currentUser!.email,
      name: auth.currentUser?.displayName,
    },
    { merge: true }
  );
}
