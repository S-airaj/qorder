import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions, FlatList, Text, Image, Alert, Pressable } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import OrderService from "../../apiService/core/OrderService";
import GloabalService from "../../apiService/globalService/GloabalService";
import { LoadingScreen } from "../../components";
import { COLORS } from "../../constant";
import { SafeAreaView } from "react-native-safe-area-context";

interface Order {
  Id: number;
  Date: string;
  OrderStatus: { Name: string };
  ServiceLocation: { Id: number };
  TotalWithTax: number;
  TotalWithoutTax: number;
}

interface OrgData {
  LogoImageUrl: string;
  Name: string;
}


interface Props {
  navigation: any;
}


interface State {
  isLoading: boolean;
  Token: string;
  orderList: Order[];
  currency: string;
  logoImage: string | null;
  orgdata: OrgData;
}

export default class OrderHistoryListScreen extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false,
      Token: '',
      orderList: [],
      currency: "",
      logoImage: null,
      orgdata: { LogoImageUrl: "", Name: "" }
    }
  }

  componentDidMount() {
    this.getOrderList(1);
  }

  getOrderList = (pageIndex: number) => {
    this.setState({ isLoading: true });
    var data = {
      i: pageIndex,
      s: 5
    }
    OrderService.getOrderList(data)
      .then((response: any) => {
        console.log("order history", response.data.Result);
        this.setState({ isLoading: false, orderList: response.data.Result.Result });
      })
      .catch(error => {
        this.setState({ isLoading: false });
      });
  }

  add = () => {
    Alert.alert(
      "Attention",
      "This feature is under development.",
      [
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  }

  orderItems = (Id: number) => {
    Alert.alert(
      "Attention",
      "This feature is under development.",
      [
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  }

  renderOrderList = ({ item, index }: { item: any; index: number }) => {
    return (
      <Pressable onPress={() => this.orderItems(item.Id)}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Order# {item.Id}</Text>
            <Text style={styles.headerText}>{item.Date}</Text>
          </View>
          <View style={styles.body}>
            <View>
              <Text style={[styles.statusText, { color: item.Status?.Name === 'Pending' ? 'red' : item.Status?.Name === 'New' ? 'blue' : 'green' }]}>
                {item.Status?.Name}
              </Text>
            </View>
            <View style={styles.divider}></View>
            <View>
              <Text style={styles.lableText}>Tbl# </Text>
              <Text style={styles.contentText}>{item.ServiceLocation?.Id}</Text>
            </View>
            <View style={styles.divider}></View>
            <View >
              <Text style={styles.lableText}>Total w/ tax</Text>
              <Text style={styles.contentText}>{item.TotalWithTax.toFixed(2)} {this.state.currency}</Text>
            </View>
            <View style={styles.divider}></View>
            <View>
              <Text style={styles.lableText}>Total w/o tax</Text>
              <Text style={styles.contentText}>{item.TotalWithoutTax.toFixed(2)} {this.state.currency}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
              <View>
                <Text style={styles.lableText}>Payment Status: </Text>
                <Text style={styles.contentText}>{item.TransactionStatus?.Name}</Text>
              </View>
            </View>

          </View>
        </View>
      </Pressable>
    );
  }

  render() {
    const { isLoading, orderList } = this.state;
    console.log("item", this.state.orderList)
    if (isLoading) {
      return <LoadingScreen />;
    }
    return (
      <SafeAreaView>
        <View style={styles.backGround}>
          {this.state.isLoading ? <LoadingScreen /> :
            <><View>
              <FlatList
                numColumns={1}
                data={this.state.orderList}
                keyExtractor={(item, index) => { return item.Id.toString(); }}
                renderItem={this.renderOrderList}
                contentContainerStyle={{ padding: 10 }} />
            </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={this.add}
                style={styles.touchableOpacityStyle}>
                <Image
                  source={{
                    uri: 'https://cdn.pixabay.com/photo/2017/03/19/03/51/material-icon-2155448_960_720.png',
                  }}
                  style={styles.floatingButtonStyle} />
              </TouchableOpacity></>}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  backGround: {
    backgroundColor: COLORS.PAGE_BGCOLOR,
    borderRadius: 10,
    height: '98%',
    margin: 10
  },
  container: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    elevation: 5,
    marginHorizontal: 5,
    marginVertical: 5,
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  header: {
    width: "100%",
    flex: 0.3,
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderRadius: 10
  },
  headerText: {
    color: '#FFF',
    fontSize: 14,
    padding: 8,
    textAlign: 'center',
  },
  body: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 10,
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    overflow: 'hidden'
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  lableText: {
    fontFamily: 'open-sans-bold',
    fontSize: 14,
    color: COLORS.BLACK,
  },
  contentText: {
    fontFamily: 'open-sans-bold',
    fontSize: 14,
    color: COLORS.BLACK,
  },
  divider: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    height: "100%",
    marginLeft: 10,
    marginRight: 10,
    borderColor: COLORS.MUTED,
  },
  statuscircle: {
    borderRadius: 15,
    backgroundColor: COLORS.WARNING,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    fontFamily: 'open-sans-bold',
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 150,
    height: 150,
    //backgroundColor:'black'
  },
});