import React from "react";
import { StyleSheet, Dimensions, Platform, StatusBar, KeyboardAvoidingView, View, SafeAreaView } from "react-native";
import { AccountService } from "../../apiService/core";
import { LoadingScreen } from "../../components";
import store from "../../storeData/AuthStore";
import { COLORS } from "../../constant";
import { Text } from "@rneui/themed";
import { Button, Icon, Input, lightColors } from "@rneui/base";

interface Props {
  navigation: any;
}

interface LoginDetails {
  [key: string]: string;
  userName: string;
  password: string;
  grant_type: string;
}

interface State {
  username: string;
  password: string;
  isLoading: boolean;
  errorMsg: string;
  Token: string;
}

const { width, height } = Dimensions.get("screen");

export default class LoginScreen extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: "admin@demo.com",
      password: "admin@123",
      isLoading: false,
      errorMsg: "",
      Token: "",
    };
  }

  login = () => {
    this.setState({ isLoading: true });
    const details: LoginDetails = {
      userName: this.state.username,
      password: this.state.password,
      grant_type: "password",
    };

    let formBody: any = [];
    for (const property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    AccountService.login(formBody)
      .then((response) => {
        console.log("login api response", response.data);
        store.storeData("Token", response.data).then((res) => {
          this.setState({ isLoading: false });
          this.props.navigation.navigate({ name: "Role" });
        });
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isLoading: false,
          errorMsg: "Login unsuccessful. The username or password is incorrect.",
        });
      });
  };

  componentDidMount() {
    store.getData("Token").then((loggedin) => {
      if (loggedin) {
        this.props.navigation.navigate({ name: "Role" });
      }
    });
  }

  render() {
    return (
      <View style={[styles.flexMiddle, { backgroundColor: '#3D2C8D' }]}>
        <StatusBar hidden />
        {this.state.isLoading ? <LoadingScreen /> : <SafeAreaView>
          <View style={styles.registerContainer}>
              <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
                <View style={styles.flexCenter}>
                  <Text style={styles.welcomeText}>Welcome</Text>
                  <View style={styles.loginDetailsContainer}>
                    <Input
                      placeholder="Username"
                      value={this.state.username || ''}
                      onChangeText={(username) => this.setState({ username: username })}
                      leftIcon={<Icon name="person"  size={20} style={{marginRight: 5}}/>}
                    />
                    <Input
                      placeholder="Password"
                      secureTextEntry={true}
                      value={this.state.password || ''}
                      onChangeText={(password) => this.setState({ password: password })}
                      leftIcon={<Icon name="lock" size={20} style={{marginRight: 5}}/>}
                    />
                         <View style={styles.loginButton} >
                    <Button color="primary" onPress={this.login}>
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: COLORS.WHITE }}>
                        Login
                      </Text>
                    </Button>
                    {!!this.state.errorMsg && (
                      <Text style={styles.errorMessage}>
                        {this.state.errorMsg}
                      </Text>
                    )}
                  </View>
                  </View>
                  <View style={styles.loginButton} >
                    <Button color="primary" onPress={this.login}>
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: COLORS.WHITE }}>
                        Login
                      </Text>
                    </Button>
                    {!!this.state.errorMsg && (
                      <Text style={styles.errorMessage}>
                        {this.state.errorMsg}
                      </Text>
                    )}
                  </View>
                </View>
              </KeyboardAvoidingView>
          </View>
        </SafeAreaView>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flexMiddle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  flexCenter: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
  },

  registerContainer: {
    width: width * 0.9,
    height: Platform.OS === 'android' ? height * 0.39 : height * 0.35,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'scroll'
  },

  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },

  loginButton: {
    width: width * 0.8,
  },

  welcomeText: {
    color: '#5E72E4',
    fontWeight: '600',
    fontSize: 30,
    marginTop: 10,
    marginBottom: 20
  },

  loginDetailsContainer: {
    marginBottom: 20,
    width: width * 0.8,
    height: height * 0.35,
  },

  errorMessage: {
    fontSize: 15, textAlign: 'center', color: '#C0392B', backgroundColor: "transparent", 
  }
});