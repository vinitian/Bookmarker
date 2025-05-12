import {
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Button,
  TextInput,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, useRouter } from "expo-router";
import {
  NotoSansThaiLooped_400Regular,
  useFonts,
} from "@expo-google-fonts/noto-sans-thai-looped";
import { Trirong_700Bold } from "@expo-google-fonts/trirong";

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
  const [isFirstButtonClicked, setIsFirstButtonClicked] =
    useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    NotoSansThaiLooped_400Regular,
    Trirong_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.navigate("/");
    }
  });

  const MainButton = ({
    title,
    handleOnPress,
  }: {
    title: string;
    handleOnPress: Function;
  }) => (
    <Pressable
      onPress={handleOnPress}
      style={{
        borderRadius: 50,
        backgroundColor: "#3C5433",
        padding: 10,
        margin: 5,
        width: 200,
        // width: "200%", //TEST
        alignSelf: "center",
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          margin: 5,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );

  const SecondaryButton = ({
    title,
    handleOnPress,
  }: {
    title: string;
    handleOnPress: Function;
  }) => (
    <Pressable
      onPress={handleOnPress}
      style={{
        borderRadius: 50,
        padding: 0,
        margin: 0,
        width: 200,
        // width: "200%", //TEST
        alignSelf: "center",
      }}
    >
      <Text
        style={{
          color: "#3C5433",
          fontSize: 16,
          fontWeight: "normal",
          textAlign: "center",
          margin: 5,
          textDecorationLine: "underline",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );

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
        createUser({ auth, name });
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
      <ThemedView
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <ThemedText
          style={{
            fontSize: 32,
            lineHeight: 32,
            fontWeight: "bold",
            fontFamily: "Trirong_700Bold",
            textAlign: "center",
          }}
        >
          Bookmarker
        </ThemedText>
        <KeyboardAvoidingView
          behavior="padding"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 20,
          }}
        >
          {isFirstButtonClicked ? ( // hide fields if Signup nor Signin button has been clicked yet
            <ThemedView>
              {isSignUp ? (
                <TextInput // hide Name field if user is not signing up
                  style={styles.input}
                  placeholderTextColor="#8b8b8b"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="none"
                  placeholder="Name"
                />
              ) : null}
              <TextInput
                style={styles.input}
                placeholderTextColor="#8b8b8b"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Email"
              />
              <TextInput
                style={styles.input}
                placeholderTextColor="#8b8b8b"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Password"
              />
            </ThemedView>
          ) : null}
          {error ? <Text style={{ color: "red" }}>{error}</Text> : <></>}
          {loading ? (
            <ActivityIndicator size={"small"} style={{ margin: 28 }} />
          ) : (
            <ThemedView>
              {!isFirstButtonClicked ? (
                <>
                  <MainButton
                    title={"Sign Up"}
                    handleOnPress={() => {
                      setIsSignUp(true);
                      setIsFirstButtonClicked(true);
                    }}
                  />
                  <SecondaryButton
                    title={"Sign In"}
                    handleOnPress={() => {
                      setIsSignUp(false);
                      setIsFirstButtonClicked(true);
                    }}
                  />
                </>
              ) : isSignUp ? (
                <>
                  <MainButton title={"Sign Up"} handleOnPress={signUp} />
                  <SecondaryButton
                    title={"Already have an account? Click here to sign in"}
                    handleOnPress={() => setIsSignUp(false)}
                  />
                </>
              ) : (
                <>
                  <MainButton title={"Sign In"} handleOnPress={signIn} />
                  <SecondaryButton
                    title={"No account? Click here to sign up"}
                    handleOnPress={() => setIsSignUp(true)}
                  />
                </>
              )}
            </ThemedView>
          )}
        </KeyboardAvoidingView>
        <Link href="/">
          <ThemedText>Go to Home Page</ThemedText>
        </Link>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderColor: "#3C5433",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
  },
});
