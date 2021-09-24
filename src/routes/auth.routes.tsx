import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Home } from "../screens/Home";
import { SignIn } from "../screens/SignIn";

const { Navigator, Screen } = createStackNavigator();

import { theme } from '../global/styles/theme';

export function AuthRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        cardStyle: { backgroundColor: theme.colors.secondary100 },
      }}
    >
      <Screen name="SignIn" component={SignIn} />

      <Screen name="Home" component={Home} />
    </Navigator>
  );
}