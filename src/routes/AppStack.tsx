import React, { useState } from "react";

// React Navigation imports
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Create Stack Navigator
const { Navigator, Screen } = createStackNavigator();

// Import pages/screens
import Login from "../pages/Login";
import EventsMap from "../pages/EventsMap";

// Import authentication context and types
import {
  AuthenticationContext,
  AuthenticationContextObject,
} from "../context/AuthenticationContext";
import { User } from "../types/User";

export default function Routes() {
  // State to store the currently authenticated user
  const [authenticatedUser, setAuthenticatedUser] = useState<User>();

  // Create the authentication context object
  const authenticationContextObj: AuthenticationContextObject = {
    value: authenticatedUser as User, // Current authenticated user
    setValue: setAuthenticatedUser, // Function to update user
  };

  return (
    // Provide authentication context to the entire app
    <AuthenticationContext.Provider value={authenticationContextObj}>
      {/* Navigation container manages the navigation state */}
      <NavigationContainer>
        {/* Stack navigator for managing screen stack */}
        <Navigator
          screenOptions={{
            headerShown: false, // Hide default headers
            cardStyle: { backgroundColor: "#F2F3F5" }, // Default background color
          }}
        >
          {/* Login screen */}
          <Screen name="Login" component={Login} />

          {/* Main events map screen */}
          <Screen name="EventsMap" component={EventsMap} />
        </Navigator>
      </NavigationContainer>
    </AuthenticationContext.Provider>
  );
}
