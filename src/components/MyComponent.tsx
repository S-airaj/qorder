import React from "react";
import { View } from "react-native";
import { makeStyles, Text, Button, useThemeMode } from "@rneui/themed";

interface AppProps {
  // add any props you need for the component
}

interface AppState {
  mode: string;
}

export default class MyComponent extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      mode: "light",
    };
  }

  handleOnPress = () => {
    const { mode } = this.state;
    this.setState({ mode: mode === "dark" ? "light" : "dark" });
  };

  render() {
    const { mode } = this.state;
    return (
      <View >
        <Text h3>Start Using RNE </Text>
        <Text >
          Open up App.tsx to start working on your app!
        </Text>
        <Button onPress={this.handleOnPress}>Switch Theme</Button>
      </View>
    );
  }
}
