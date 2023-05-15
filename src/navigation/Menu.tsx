import React, { Component } from "react";
import { ScrollView, StyleSheet, Image, TouchableOpacity, View, ImageBackground, Alert, Dimensions } from "react-native";
import { DrawerItem } from "../components";
import { COLORS, IMAGES } from '../constant';
import { Icon, Text } from "@rneui/themed";
import store from "../storeData/AuthStore";
import { DrawerContentScrollView } from "@react-navigation/drawer";

const { height } = Dimensions.get('window');
const contactCardHeight = 150;
const sidebarHeight = height - contactCardHeight;

interface Props {
  drawerPosition: string;
  navigation: any;
  focused: boolean;
  state: any;
}

class CustomDrawerContent extends React.Component<any> {

  handleLogout = () => {
    Alert.alert(
      "Exit?",
      "Are you sure you want to log out?",
      [
        {
          text: "Yes",
          onPress: () => {
            store.clearData();
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }]
            });
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  render() {
    const { drawerPosition, navigation, focused, state, ...rest } = this.props;
    const screens = [
      "Home",
      "Categories",
      "Tables",
      "Products",
      "Order History"
    ];

    const containerStyles = [
      styles.defaultStyle,
      focused ? [styles.activeStyle, styles.shadow] : null
    ];

    return (

      <View style={{ flex: sidebarHeight / height }}>
        <DrawerContentScrollView
          {...this.props}
          contentContainerStyle={{ backgroundColor: '#8200d6' }}>
          <ImageBackground
            source={IMAGES.SideBarHeader}
            style={{ padding: 20 }}>
            <Image
              source={IMAGES.HeaderLogo}
              style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }}
            />
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontFamily: 'Roboto-Medium',
                marginBottom: 5,
              }}>
              John Doe
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Roboto-Regular',
                  marginRight: 5,
                }}>
                johndoe@gmail.com
              </Text>
            </View>
          </ImageBackground>
          <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 5 }}>
            {screens.map((item, index) => {
              return (
                <DrawerItem
                  title={item}
                  key={index}
                  navigation={navigation}
                  focused={state.index === index ? true : false}
                />
              );
            })}
            <View style={{ flex: 1, marginTop: 8 }}>
              <View style={styles.divider} />
              <Text style={{ marginTop: 5, marginLeft: 5, color: "#8898AA" }}>Others</Text>
              <TouchableOpacity onPress={() => { }} style={{ paddingVertical: 10, paddingHorizontal: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="information-circle" size={20} color={focused ? "white" : COLORS.PRIMARY} />
                  <Text
                    style={{
                      fontSize: 15,
                      marginLeft: 5,
                      fontWeight: "normal",
                      color: "rgba(0,0,0,0.5)",
                    }}>
                    About
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { this.handleLogout() }} style={{ paddingVertical: 10, paddingHorizontal: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="exit-to-app" size={20} color={focused ? "white" : COLORS.PRIMARY} />
                  <Text
                    style={{
                      fontSize: 15,
                      marginLeft: 5,
                      fontWeight: "normal",
                      color: "rgba(0,0,0,0.5)",
                    }}>
                    Sign Out
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </DrawerContentScrollView>
        <View style={{ padding: 5 }}>
          <View style={{ flex: 1, marginVertical: 8, paddingHorizontal: 8 }}>
            <View style={styles.contactCard}>
              <Text style={{ color: "white" }}>Contact Us</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  divider: {
    borderColor: "rgba(0,0,0,0.2)", width: '100%', borderWidth: StyleSheet.hairlineWidth
  },

  header: {
    resizeMode: 'center',
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    alignSelf: 'center',
  },

  contactCard: {
    backgroundColor: "#43A6C6",
    shadowColor: '#000000',
    shadowOffset: {
      height: 3,
      width: 3
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderRadius: 3,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: contactCardHeight
  },

  cardimage: {
    width: 400,
    height: 400,
    borderRadius: 10,
  },

  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16
  },

  activeStyle: {
    backgroundColor: COLORS.ACTIVE,
    borderRadius: 4,
    color: '#FFF'
  },

  shadow: {
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.1
  }
});

export default CustomDrawerContent;
