import React from "react";
import { createTheme, ThemeProvider } from "@rneui/themed";
import { enableScreens } from "react-native-screens";
enableScreens();
import { NavigationContainer } from "@react-navigation/native";
import Screens from "./src/navigation/Screens";
import { StripeProvider } from "@stripe/stripe-react-native";

const theme = createTheme({
  lightColors: {},
  darkColors: {},
});

export default function App() {
  return (
    <StripeProvider
      publishableKey="pk_test_51K7T1LBD7wj8vgHB4JilkoWuXy6c1b8gbTR91qRcJf7hR6DAQHkmvI3A5ugWqW7gQeDBAvo0ryoYGqp4ZeNrn2Mj00x49U2jh2"
    >
      <NavigationContainer>
        <ThemeProvider theme={theme}>
          <Screens />
        </ThemeProvider>
      </NavigationContainer>
    </StripeProvider>

  );
}
