import React from "react";
import { StyleSheet, TouchableOpacity, Alert, View, Text } from "react-native";
import { COLORS } from "../constant/Colors";
import { Icon } from "@rneui/themed";

interface Props {
  title: string;
  focused: boolean;
  navigation: any;
}

class DrawerItem extends React.Component<Props> {
  renderIcon = () => {
    const { title, focused } = this.props;

    switch (title) {
      case "Home":
        return (
          <Icon
            name="home"
            size={20}
            color={focused ? "white" : COLORS.PRIMARY}
          />
        );
        case "Tables":
          return (
            <Icon
              name="chain"
              size={20}
              color={focused ? "white" : COLORS.PRIMARY}
            />
          );
          case "Products":
            return (
              <Icon
              name="chain"
                size={20}
                color={focused ? "white" : COLORS.PRIMARY}
              />
            );
            case "Categories":
              return (
                <Icon
                  name="chain"
                  size={20}
                  color={focused ? "white" : COLORS.PRIMARY}
                />
              );
      default:
        return null;
    }
  };

  Logout = () => {

  }

  render() {
    const { focused, title, navigation } = this.props;
    const containerStyles = [
      styles.defaultStyle,
      focused ? [styles.activeStyle, styles.shadow] : null
    ];

    return (
      <TouchableOpacity
        onPress={() =>
          title == "Logout"
            ? this.Logout()
            : navigation.navigate(title)
        }
      >
        <View style={[containerStyles, {display: 'flex', flexDirection: 'row'}]}>
          <View style={{ marginRight: 5 }}>
            {this.renderIcon()} 
          </View>
          <View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: focused ? "bold" : "normal",
                color: focused ? "white" : "rgba(0,0,0,0.5)",
                }}
            >
              {title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  activeStyle: {
    backgroundColor: COLORS.ACTIVE,
    borderRadius: 4,
    margin: 10,
    paddingVertical: 10,
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
  },
});

export default DrawerItem;
