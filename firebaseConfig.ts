// import { initializeApp } from "firebase/app";
// import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// import { Platform } from "react-native";


// let appId = "";
// if (Platform.OS === "web") {
//   appId = process.env.EXPO_FIREBASE_WEB_APP_ID ?? "";
// } else if (Platform.OS === "android") {
//   appId = process.env.EXPO_FIREBASE_ANDROID_APP_ID ?? "";
// } else {
//   throw new Error(
//     `Unsupported platform: ${Platform.OS}. Please ensure your platform is supported.`
//   );
// }


// const firebaseConfig = {
//   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "",
//   authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
//   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "",
//   storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
//   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
//   appId: appId,
// };

// const app = initializeApp(firebaseConfig);

// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });

// export { auth, app };


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import 'firebase/firestore';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSEAcz4rB34CxWK0GHDEcLbDgLdLeem3E",
  authDomain: "bookmarker-d0222.firebaseapp.com",
  projectId: "bookmarker-d0222",
  storageBucket: "bookmarker-d0222.firebasestorage.app",
  messagingSenderId: "524275496019",
  appId: "1:524275496019:web:5435b50cd6d0bcca7a02a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { app, auth, storage, db };