import {
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Button,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, useRouter } from "expo-router";

import { registerTranslation } from "react-native-paper-dates";
registerTranslation("en", {
  save: "Save",
  selectSingle: "Select date",
  selectMultiple: "Select dates",
  selectRange: "Select period",
  notAccordingToDateFormat: (inputFormat) =>
    `Date format must be ${inputFormat}`,
  mustBeHigherThan: (date) => `Must be later then ${date}`,
  mustBeLowerThan: (date) => `Must be earlier then ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Must be between ${startDate} - ${endDate}`,
  dateIsDisabled: "Day is not allowed",
  previous: "Previous",
  next: "Next",
  typeInDate: "Type in date",
  pickDateFromCalendar: "Pick date from calendar",
  close: "Close",
  hour: "Hour",
  minute: "minute",
});
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { createUser } from "@/lib/editUser";

export default function login() {

  const [isFirstButtonClicked, setIsFirstButtonClicked] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.navigate("/home");
    }
  });

  const signUp = () => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(() =>
        auth.onAuthStateChanged((user) => {
          if (user) {
            console.log(user.uid);
          }
        })
      )
      .then((_) => {
        createUser({auth, name});
      })
      .catch((e: FirebaseError) => {
        if (e.code === "auth/weak-password") {
          setError("Password should be longer than 6 characters");
        } else if (e.code === "auth/email-already-in-use") {
          setError("Email already exists");
        } else if (e.code === "auth/invalid-email") {
          setError("Invalid email");
        } else {
          setError(e.message);
        }
      });
    setLoading(false);
  };
  const signIn = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((_) => {
        setEmail("");
        setPassword("");
      })
      .then(() =>
        auth.onAuthStateChanged((user) => {
          if (user) {
            console.log(user.uid);
          }
        })
      )
      .catch((e) => {
        console.log(e.code, e.message);
        if (e.code === "auth/invalid-email") {
          setError("Invalid email");
        } else if (e.code === "auth/wrong-password") {
          setError("Wrong password");
        } else if (e.code === "auth/invalid-credential") {
          setError("Either email or password is incorrect");
        } else if (e.code === "auth/user-not-found") {
          setError("User not found");
        } else if (e.code === "auth/missing-password") {
          setError("Missing password");
        } else {
          setError(e.message);
        }
      });
    setLoading(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 8,
          borderWidth: 1,
        }}
      >
        Bookmarker
      </ThemedText>
      <KeyboardAvoidingView behavior="padding">
        { isFirstButtonClicked ? // hide fields if Signup nor Signin button has been clicked yet
        <>
          { isSignUp ? <TextInput // hide Name field if user is not signing up
            style={styles.input}
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
            placeholder="Name"
          /> : null
          }
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
          />
        </> : null 
        }
        {error ? <Text style={{ color: "red" }}>{error}</Text> : <></>}
        {loading ? (
          <ActivityIndicator size={"small"} style={{ margin: 28 }} />
        ) : (
          <> { !isFirstButtonClicked ?
            <>
              <Button onPress={()=>{setIsSignUp(true);setIsFirstButtonClicked(true)}} title="Sign Up" />
              <Button onPress={()=>{setIsSignUp(false);setIsFirstButtonClicked(true)}} title="Sign In" />
            </>
            : isSignUp ?
            <>
              <Button onPress={signUp} title="Sign Up" />
              <Button onPress={()=>setIsSignUp(false)} title="Already have an account? Click here to sign in" />
            </>
            :
            <>
              <Button onPress={signIn} title="Sign In" />
              <Button onPress={()=>setIsSignUp(true)} title="No account? Click here in sign up" />
            </>
          }
          </>
        )}
      </KeyboardAvoidingView>
      <Link href="/home">
        <ThemedText>Go to Home Page</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
  },
});
