import { Icon } from '@rneui/base';
import React, { Component } from 'react'
import { View, Modal, TextInput, SafeAreaView, Image, ScrollView, FlatList, StyleSheet, Dimensions, Alert } from 'react-native';
import OrderService from '../../apiService/core/OrderService';
import { COLORS } from '../../constant';
import { Button, Text } from '@rneui/themed';
import CartManager from '../../manager/CartManager';
import { presentPaymentSheet } from '@stripe/stripe-react-native';
import baseURL from '../../host/Host';
import { LoadingScreen } from '../../components';

const { width, height } = Dimensions.get("window");

interface Props {
  navigation: any;

}

interface State {
  isLoading: boolean,
  Token: string,
  modalOneVisible: boolean,
  modalTwoVisible: boolean,
  tableId: number,
  orderDate: string,
  isEmpty: boolean,
  order: any,
  subTotal: number,
}

export default class CartScreenComponent extends Component<any, State> {
  cm: CartManager;
  constructor(props: any) {
    super(props);
    this.cm = new CartManager({})
    this.state = {
      isLoading: false,
      Token: '',
      modalOneVisible: false,
      modalTwoVisible: false,
      tableId: this.props.route.params.tableId,
      orderDate: this.props.route.params.orderDate,
      isEmpty: this.props.route.params.isEmpty,
      order: this.props.route.params.order,
      subTotal: this.props.route.params.subTotal
    }
  }

  componentDidMount() {
    console.log("update car", this.props.route.params);
  }

  clearCart = (tableId: number, orderDate: string) => {
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

  add = (BillableId: number, order: any, tableId: number, orderDate: string) => {
    console.log("add", order);
    const cartdata = order.Products
    for (var item in cartdata) {
      console.log(cartdata);
      if (cartdata[item].BillableId == BillableId) {
        console.log(cartdata[item].Quantity);
        cartdata[item].Quantity = cartdata[item].Quantity + 1
        var total = (cartdata[item].CurrentAmount - cartdata[item].Discount) * cartdata[item].Quantity
        var tax = total * (1 + cartdata[item].TaxCode / 100)
        order.TotalWithoutTax += total
        order.TotalWithTax += tax
      }
    }

    this.setState({ order: order, subTotal: order.TotalWithTax.toFixed(2) });
  }

  remove = (BillableId: number, order: any, tableId: number, orderDate: string) => {
    const cartdata = order.Products
    let _index = 0;
    for (var item in cartdata) {
      if (cartdata[item].BillableId == BillableId) {
        var total = (cartdata[item].CurrentAmount - cartdata[item].Discount) * 1
        var tax = total * (1 + cartdata[item].TaxCode / 100)
        if (cartdata[item].Quantity == 1) {
          cartdata.splice(_index, 1)
        }
        else {
          cartdata[item].Quantity = cartdata[item].Quantity - 1
        }
        order.TotalWithoutTax -= total
        order.TotalWithTax -= tax
      }
      _index++;
    }
    this.setState({ order: order, subTotal: order.TotalWithTax.toFixed(2) });

  }

  delete = (BillableId: number, order: any, tableId: number, orderDate: string) => {
    const cartdata = order.Products;
    let _index = 0;

    for (var item in cartdata) {
      if (cartdata[item].BillableId == BillableId) {
          Alert.alert(
          'Delete Item',
          'Are you sure you want to delete this item?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: () => {
                var total = (cartdata[item].CurrentAmount - cartdata[item].Discount) * 1
                var tax = total * (1 + cartdata[item].TaxCode / 100)
                if (cartdata[item].Quantity >= 1) {
                  cartdata.splice(_index, 1);
                  console.log("cart delete ", order);
                }
                
                order.TotalWithoutTax -= total;
                order.TotalWithTax -= tax;
                _index++;
                this.setState({ order: order, subTotal: order.TotalWithTax.toFixed(2) });
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
  }
  

  showModal = (modal: any) => {
    switch (modal) {
      case "MODAL_1":
        this.setState({ modalOneVisible: true, })
        setTimeout(() => {
          this.setState({ modalOneVisible: false });
        }, 4000);
        break;

      case "MODAL_2":
        this.setState({ modalTwoVisible: true, })
        setTimeout(() => {
          this.setState({ modalTwoVisible: false });
        }, 3000);
        break;
    }
  };


  createOrder = () => {
    this.setState({ isLoading: true });
    if (this.state.order == null || this.state.order.Products.length == 0.) {
      Alert.alert(
        "Attention",
        "Please add items in cart to place order.",
        [
          {
            text: "Cancel",
            style: "cancel"
          }
        ]
      );
      this.setState({ isLoading: false });
      return;
    }
    let orderproducts = this.state.order.Products
    let tableId = this.state.tableId
    let payload = {
      OrderProductList: orderproducts,
      ServiceLocationId: tableId,
      CustmerId: 0,
    }
    console.log("created order data", payload);

    OrderService.createOrder(payload)
      .then(response => {
        this.setState({ isLoading: false });
        this.showModal("MODAL_2");
        setTimeout(() => {
          this.props.navigation.navigate({ name: "Payments", params: { amount: this.state.subTotal, invoiceId: response.data.Result } });
        }, 3000);
      })
      .catch(error => {
        console.log("created order data FAILED", error.response.data);
        Alert.alert("Something went wrong. Order creation failed.",);
        this.setState({ isLoading: false });

      });
  }


  renderProducts = ({ item, index }: { item: any, index: number }) => {
    let { cardimage, } = styles
    let totalAmount = item.CurrentAmount * item.Quantity
    return (
      <View style={styles.cartProductCard}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={styles.wraptext}>
            <Text style={styles.labelfont}>{item.Name}</Text>
            <Text style={styles.contentfont}>{"Price:" + ' ' + item.CurrentAmount.toFixed(2)} </Text>
            <Text style={styles.contentfont}>{"Quantity:" + ' ' + item.Quantity}</Text>
            <Text style={styles.contentfont}>{"Total:" + ' ' + totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.quantityCircle}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.Quantity}</Text>
          </View>
          <View style={styles.quantityButtonGroup}>
            <Text style={{ fontSize: 33, color: COLORS.PRIMARY }} onPress={() => this.remove(item.BillableId, this.state.order, this.state.tableId, this.state.orderDate)}>-</Text>
            <Text onPress={() => this.showModal("MODAL_1")} style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.PRIMARY }}>
              {item.Quantity}</Text>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalOneVisible}
              onRequestClose={() => this.showModal("MODAL_1")}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TextInput
                    placeholder="Enter Quantity"
                    value={item.Quantity || ''}
                    placeholderTextColor="#898B8A"
                    keyboardType='number-pad'
                  />
                </View>
              </View>
            </Modal>
            <Text style={{ fontSize: 33, color: COLORS.PRIMARY }}
              onPress={() => this.add(item.BillableId, this.state.order, this.state.tableId, this.state.orderDate)}>+</Text>
          </View>
          <Button color={'#FF0000'} style={{ width: 40, height: 50 }}>
            <Text style={{ fontSize: 14, color: COLORS.WHITE }} onPress={() => this.delete(item.BillableId, this.state.order, this.state.tableId, this.state.orderDate)}>Delete</Text>
          </Button>
        </View>
      </View>
    )
  }



  render() {
    let { container, screenHeader, screenHeaderText, backGround } = styles
    let { order, subTotal, isEmpty } = this.state;

    return (
      <View style={backGround}>
        <View style={styles.container}>
          {this.state.isLoading ? (
            <LoadingScreen />
          ) : (
            <SafeAreaView style={{ flex: 1 }}>
              <View style={screenHeader}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 8 }}>
                  <Text style={screenHeaderText}>Total W/ Tax: ${subTotal == null ? 0 : subTotal}</Text>
                </View>
              </View>
              {isEmpty ? (
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1
                }}>
                  <Image
                    source={{ uri: 'https://static.vecteezy.com/system/resources/previews/006/736/566/original/illustration-file-not-found-or-404-error-page-free-vector.jpg' }}
                    style={{ width: 400, height: 400 }} ></Image>
                  <Text style={[styles.cardtext, {
                    fontSize: 20,
                    fontWeight: 'bold'
                  }]} >Oops, cart is empty......</Text>
                  <Text style={styles.cardtext} >Please order the menu items </Text>
                </View>
              ) : (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={order.Products}
                  keyExtractor={item => item.id}
                  renderItem={this.renderProducts}
                  contentContainerStyle={{ padding: 10 }} />
              )}
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalTwoVisible}
                onRequestClose={() => this.showModal("MODAL_2")}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Image
                      source={{ uri: 'http://rechorderp.com/app/images/verfied-tick.png' }}
                      style={{ width: 200, height: 200, transform: [{ scale: 0.8 }] }} />
                    <Text>
                      Order has been placed successfully.
                      Redirecting to payment screen...
                    </Text>
                  </View>
                </View>
              </Modal>
              <View style={{ flexDirection: "row", justifyContent: 'space-between', padding: 10 }}>
                <View>
                  <Button color={COLORS.PRIMARY} onPress={() => this.createOrder()}>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: COLORS.WHITE }}> Place Order</Text>
                  </Button>
                </View>
                <View>
                  <Button color={COLORS.PRIMARY} onPress={() => this.clearCart(this.props.tableId, this.props.orderDate)}>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: COLORS.WHITE }}> Delete Cart </Text>
                  </Button>
                </View>
              </View>
            </SafeAreaView>
          )}
        </View>
      </View>
    );
  }

};

const styles = StyleSheet.create({
  backGround: {
    backgroundColor: COLORS.PAGE_BGCOLOR,
    borderRadius: 10,
    height: "98%",
    marginBottom: 5
  },
  quantityCircle: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 30,
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 50,
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },

  addbutton: {
    width: width * 0.5,
    marginTop: 20
  },
  screenHeader: {
    shadowColor: '#000000',
    shadowOffset: {
      height: 3,
      width: 3
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderRadius: 3,
    elevation: 4,
    backgroundColor: COLORS.PRIMARY,
    width: '100%',
    height: 50,
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY
  },
  screenHeaderText: {
    marginStart: 10,
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold'
  },
  quantityButtonGroup: {
    width: 150,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    flexDirection: "row",
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  labelfont: {
    fontSize: 14,
    fontWeight: "700"
  },
  contentfont: {
    fontSize: 11,
    opacity: .7
  },
  button: {
    display: 'flex',
    height: 30,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    shadowColor: '#2AC062',
    shadowOpacity: 1,
    shadowOffset: {
      height: 10,
      width: 0
    },
    shadowRadius: 20,
  },

  container: {
    flex: 1,

  },
  cardtext: {
    fontSize: 20,
    color: '#212121'
  },
  cartProductCard: {
    shadowColor: '#000000',
    shadowOffset: {
      height: 3,
      width: 3
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: "#fff",
    borderRadius: 3,
    elevation: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    height: 100,
    flexDirection: 'row',
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY
  },
  cardimage: {
    width: "30%",
    height: "100%",
    borderRadius: 10
  },
  wraptext: {
    flex: 1,
    marginLeft: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  quantitysquare: {
    position: 'relative',
    width: 40,
    height: 40,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    width: width * 0.9,
    height: 300,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});