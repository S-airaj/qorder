import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, StatusBar, TouchableOpacity, Platform, Touchable } from 'react-native';
import { COLORS } from '../../constant';
import { LoadingScreen } from '../../components';
import { AccountService } from '../../apiService/core';
import store from '../../storeData/AuthStore';
import { Text } from "@rneui/themed";
import { Button, Input } from "@rneui/base";
import { SafeAreaView } from 'react-native-safe-area-context';

const { height, width } = Dimensions.get('window');
const roleTextContainer = 65;
const roleTextContainerWidth = width - roleTextContainer;

interface Token {
  access_token: string;
  domainkey: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

interface RoleAuthData {
  [key: string]: any;
  grant_type: string,
  refresh_token: string,
  Role: number,
  client_id: string
}

interface Props {
  navigation: any;
}

interface State {
  selectedRole: string;
  isLoading: boolean;
  Token: Token;
  errorMsg: string;
  roleData: any[];
}


export default class RoleScreen extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedRole: '',
      isLoading: false,
      Token: {
        access_token: '',
        domainkey: '',
        expires_in: 0,
        refresh_token: '',
        token_type: ''
      },
      errorMsg: '',
      roleData: []
    };

    store.getData('Token').then(res => {
      this.setState({ Token: res, isLoading: true })
    })
  }

  componentDidMount() {
    this.getRole();
  }

  getRole() {
    AccountService.getRole()
      .then(response => {
        this.setState({ isLoading: false, roleData: response.data.Result });
      })
      .catch(error => {
        this.setState({ isLoading: false, errorMsg: 'Something went wrong.' });
        store.clearData();
      });
  }

  clickContinue = (role: number) => {
    const details: RoleAuthData = {
      grant_type: 'refresh_token',
      refresh_token: this.state.Token.refresh_token,
      Role: role,
      client_id: 'ngAuthApp'
    };

    let formBody: any = [];
    for (const property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    this.setState({ isLoading: true });
    AccountService.roleAuth(formBody, this.state.Token)
      .then(response => {
        console.log('getting response of role api', response.data);
        this.setState({ isLoading: false });
        store.storeData('Token', response.data).then(res => {
          this.setState({ isLoading: false });
          this.props.navigation.navigate('App')
        })
      })
      .catch(error => {
        console.log(error);
        store.clearData();
        this.props.navigation.navigate({ 'name': 'Login' })
        this.setState({ isLoading: false, errorMsg: 'Something went wrong. Failed to fetch role.' });
      });
  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: '#3D2C8D', flex: 1 }}>
        <StatusBar hidden />
        {this.state.isLoading ? <LoadingScreen /> :
          <View style={styles.flexMiddle} >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.roleTextTitle}>
                Select Role</Text>
              {this.renderRoles()}
            </ScrollView>
          </View>
        }
      </SafeAreaView>
    )
  }

  renderRoles() {
    const items: any = [];
    this.state.roleData.map((item, key) => {
      items.push(
        <SafeAreaView style={[styles.flexMiddle, { marginTop: 10, margin: 5, alignItems: 'center' }]}>
          <TouchableOpacity key={item.Id}  onPress={() => this.clickContinue(item.Id)}>
            <View style={styles.roleTextContainer}>
              <Text style={styles.roleText}>
                {item.Name}</Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      );
    })
    return items
  }
}

const styles = StyleSheet.create({
  roleContainer: {
    width: Platform.OS === 'android' ? width * 0.35 : width * 0.9,
    height: Platform.OS === 'android' ? height * 0.3 : height * 0.3,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 5,
    overflow: "hidden",
    marginBottom: "40%",
  },

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

  roleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.PRIMARY
  },

  roleTextContainer: {
    borderRadius: 3,
    elevation: 4,
    width: roleTextContainerWidth,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginEnd: 10,
    marginBottom: 5,
    height: 65,
    flexDirection: 'row'
  },

  roleTextTitle: {
    marginTop: 150,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff'
  },
});
