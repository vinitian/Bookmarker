import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Button,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
// import auth from "@react-native-firebase/auth";
// import { FirebaseError } from "firebase/app";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";

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

export default function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    try {
      // await auth().createUserWithEmailAndPassword(email, password);
    } catch (e: any) {
      const err = e;
      alert("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  const signIn = async () => {
    setLoading(true);
    try {
      // await auth().signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      const err = e;
      alert("Sign in failed: " + err.message);
    } finally {
      setLoading(false);
    }
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
        {loading ? (
          <ActivityIndicator size={"small"} style={{ margin: 28 }} />
        ) : (
          <>
            <Button onPress={signIn} title="Login" />
            <Button onPress={signUp} title="Create account" />
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
