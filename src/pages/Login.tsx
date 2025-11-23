import { useIsFocused } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Spinner from "react-native-loading-spinner-overlay";
import BigButton from "../components/BigButton";
import Spacer from "../components/Spacer";
import { AuthenticationContext } from "../context/AuthenticationContext";
import logoImg from "../images/logo.png";
import * as api from "../services/api";
import { getFromCache, setInCache } from "../services/caching";
import { User } from "../types/User";
import { isTokenExpired, sanitizeEmail, validateEmail } from "../utils";

export default function Login({ navigation }: StackScreenProps<any>) {
  // Access global authentication state/context
  const authenticationContext = useContext(AuthenticationContext);

  // Local state for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State to track input validation
  const [emailIsInvalid, setEmailIsInvalid] = useState<boolean>();
  const [passwordIsInvalid, setPasswordIsInvalid] = useState<boolean>();

  // State for authentication errors
  const [authError, setAuthError] = useState<string>();

  // State to track if cached token is valid
  const [accessTokenIsValid, setAccessTokenIsValid] = useState<boolean>(false);

  // State to show loading spinner during login
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Detect when the screen is focused (useful for StatusBar)
  const isFocused = useIsFocused();

  // Effect: Load cached user/token & show auth errors
  useEffect(() => {
    // Try to get cached user info
    getFromCache("userInfo").then(
      (cachedUserInfo) =>
        authenticationContext?.setValue(cachedUserInfo as User),
      (error: any) => console.log(error) // Ignore if not in cache
    );

    // Try to get cached access token and validate it
    getFromCache("accessToken").then(
      (accessToken) =>
        accessToken &&
        !isTokenExpired(accessToken as string) &&
        setAccessTokenIsValid(true),
      (error: any) => console.log(error)
    );

    // Show alert if there's an authentication error
    if (authError)
      Alert.alert("Authentication Error", authError, [
        { text: "Ok", onPress: () => setAuthError(undefined) },
      ]);
  }, [authError]);

  // Effect: Navigate automatically if valid token exists
  useEffect(() => {
    if (accessTokenIsValid && authenticationContext?.value)
      navigation.navigate("EventsMap");
  }, [accessTokenIsValid]);

  // Handler: Authenticate user on login
  const handleAuthentication = () => {
    if (formIsValid()) {
      setIsAuthenticating(true); // Show spinner

      // Call API to authenticate
      api
        .authenticateUser(sanitizeEmail(email), password)
        .then((response) => {
          // Save user info & access token in cache
          setInCache("userInfo", response.data.user);
          setInCache("accessToken", response.data.accessToken);

          // Update global authentication state
          authenticationContext?.setValue(response.data.user);

          setIsAuthenticating(false); // Hide spinner
          navigation.navigate("EventsMap"); // Navigate to main screen
        })
        .catch((error) => {
          // Handle API errors
          if (error.response) {
            setAuthError(error.response.data); // Show server-provided message
          } else {
            setAuthError("Something went wrong."); // Fallback message
          }
          setIsAuthenticating(false);
        });
    }
  };

  // Form validation
  const formIsValid = () => {
    const emailIsValid = !isEmailInvalid();
    const passwordIsValid = !isPasswordInvalid();
    return emailIsValid && passwordIsValid;
  };

  // Check if password meets minimum length
  const isPasswordInvalid = (): boolean => {
    const invalidCheck = password.length < 6;
    setPasswordIsInvalid(invalidCheck);
    return invalidCheck;
  };

  // Check if email is valid
  const isEmailInvalid = (): boolean => {
    const invalidCheck = !validateEmail(email);
    setEmailIsInvalid(invalidCheck);
    return invalidCheck;
  };

  // Render
  return (
    <LinearGradient
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      colors={["#031A62", "#00A3FF"]}
      style={styles.gradientContainer}
    >
      {isFocused && <StatusBar animated translucent style="light" />}

      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{
          padding: 24,
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        <Image
          resizeMode="contain"
          style={{ width: 240, height: 142, alignSelf: "center" }}
          source={logoImg}
        />

        <Spacer size={80} />

        {/* Email input */}
        <View style={styles.inputLabelRow}>
          <Text style={styles.label}>Email</Text>
          {emailIsInvalid && <Text style={styles.error}>invalid email</Text>}
        </View>
        <TextInput
          style={[styles.input, emailIsInvalid && styles.invalid]}
          onChangeText={(value) => setEmail(value)}
          onEndEditing={isEmailInvalid}
        />

        {/* Password input */}
        <View style={styles.inputLabelRow}>
          <Text style={styles.label}>Password</Text>
          {passwordIsInvalid && (
            <Text style={styles.error}>invalid password</Text>
          )}
        </View>
        <TextInput
          style={[styles.input, passwordIsInvalid && styles.invalid]}
          secureTextEntry={true}
          onChangeText={(value) => setPassword(value)}
          onEndEditing={isPasswordInvalid}
        />

        <Spacer size={80} />

        {/* Login button */}
        <BigButton
          style={{ marginBottom: 8 }}
          onPress={handleAuthentication}
          label="Log in"
          color="#FF8700"
        />

        {/* Loading spinner */}
        <Spinner
          visible={isAuthenticating}
          textContent={"Authenticating..."}
          overlayColor="#031A62BF"
          textStyle={styles.spinnerText}
        />
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  spinnerText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },

  label: {
    color: "#fff",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
  },

  inputLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1.4,
    borderColor: "#D3E2E5",
    borderRadius: 8,
    height: 56,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    color: "#5C8599",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
  },

  invalid: {
    borderColor: "red",
  },

  error: {
    color: "white",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
  },
});
