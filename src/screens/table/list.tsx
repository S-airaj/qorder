import React from 'react'
import { Alert, Dimensions, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { LoadingScreen } from '../../components';
import moment from 'moment';
import { Button } from '@rneui/themed';
import { COLORS } from '../../constant';
import { TableService } from '../../apiService/core';
import OrderStore from '../../storeData/OrderStore';

const { width, height } = Dimensions.get('window');
const cardWidth = 350;
const numColumns = Math.floor(width / cardWidth);
const tileSize = width / numColumns

interface Props {
  navigation: any;
}

interface State {
  isLoading: boolean;
  Token: string;
  tableList: any[];
  orderCount: any;
}


export default class TableListScreen extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false,
      Token: "",
      tableList: [],
      orderCount: {},
    };
  }

  componentDidMount = () => {
    this.getTableList();
  }

  render() {
    return (
      <SafeAreaView>
        <View style={styles.backGround}>
          {this.state.isLoading ? <LoadingScreen /> :
            <><View>
              <FlatList
                numColumns={numColumns}
                data={this.state.tableList}
                keyExtractor={(item, index) => { return item.Id.toString(); }}
                renderItem={this.renderTableList}
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
    )
  }

  createOrder = (tableId: any) => {
    var newDate = moment(new Date()).format('DD/MM/YYYY HH:MM:SS A')
    this.props.navigation.navigate({ "name": "Menu", params: { orderDate: newDate, tableId: tableId } });
  }

  activeOrder = (tableId: any) => {
    this.props.navigation.navigate({ "name": "Active orders", params: { Id: tableId } });
  }

  getTableList = () => {
    this.setState({ isLoading: true });
    TableService.getTableList()
      .then(response => {
        for (var i = 0; i < response.data.Result.length; i++) {
          var item = response.data.Result[i];
          console.log("table data", item)
          var count = 0;
          OrderStore.getData("Order_" + item.Id).then(res => {
            console.log("res", res);
            count = res ? Object.keys(res).length : 0;
            console.log("count", count);
            //   this.state.orderCount["Order_" + item.Id] = count
            // console.log("test",this.state.orderCount["Order_" + item.Id])
            this.setState({ isLoading: false, orderCount: count, tableList: response.data.Result });
          })
        }
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

  edit = (Id: number) => {
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

  renderTableList = ({ item, index }: { item: any, index: number }) => {
    var startTime = item.StartTime.substring(item.StartTime.indexOf(' '));
    var endTime = item.EndTime.substring(item.StartTime.indexOf(' '));
    return (
      <Pressable style={styles.box} onPress={() => this.edit(item.Id)}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{item.Name}</Text>
          <Text style={styles.headerText}>{startTime} - {endTime}</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Location:</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{item.Counter?.Name}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Max Orders:</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{item.MaxNoOfOrders}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => this.activeOrder(item.Id)}>
              <View style={styles.orderCount}>
                <Text style={styles.orderCountText}>{this.state.orderCount}</Text>
              </View>
              <Text style={styles.buttonText}>Active Orders</Text>
            </TouchableOpacity>
            <View style={styles.divider}></View>
            <TouchableOpacity style={[styles.button, styles.newOrderButton]} onPress={() => this.createOrder(item.Id)}>
              <Text style={[styles.buttonText, styles.newOrderButtonText]}>New Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  backGround: {
    backgroundColor: COLORS.PAGE_BGCOLOR,
    borderRadius: 10,
    height: '98%',
    margin:10
  },
  box: {
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
    fontSize: 18,
    padding: 8,
    textAlign: 'center',
  },
  body: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 10,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  labelContainer: {
    flex: 1,
    marginRight: 10,
  },
  valueContainer: {
    flex: 2,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    flex: 1,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 10,
  },
  orderCount: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 100,
    height: 20,
    marginRight: 5,
    width: 20,
  },
  orderCountText: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
  },
  buttonText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
  },
  newOrderButton: {
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 0,
    paddingHorizontal: 20,
  },
  newOrderButtonText: {
    color: '#FFF',
  },
  divider: {
    backgroundColor: COLORS.PRIMARY,
    height: '100%',
    width: 1,
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