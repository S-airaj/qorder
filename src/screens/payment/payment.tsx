import { CardField, PresentPaymentSheetResult, presentPaymentSheet, retrievePaymentIntent, initPaymentSheet } from '@stripe/stripe-react-native';
import React, { Component } from 'react'
import { Alert, Dimensions, Image, Modal, SafeAreaView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import OrderService from '../../apiService/core/OrderService';
import { Button } from '@rneui/themed';
import { COLORS } from '../../constant';
import { LoadingScreen } from '../../components';
import baseURL from '../../host/Host';
const { width, height } = Dimensions.get("window");


interface Props {
  navigation: any;
}

interface State {
  modalVisible: boolean,
  isLoading: boolean,
  amount: number,
  errorMessage: string,
  invoiceId: number
}

interface PaymentSheetParams {
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
  publishableKey: string;
}

export default class PaymentScreenComponent extends React.Component<any, State> {

  constructor(props: any) {
    super(props)
    this.state = {
      modalVisible: false,
      isLoading: false,
      amount: this.props.route.params.amount,
      errorMessage: '',
      invoiceId: this.props.route.params.invoiceId
    }
  }

  updateTransaction = () => {
    console.log("transaction started", this.state.invoiceId);
    OrderService.updateTransaction(this.state.invoiceId)
      .then((response: any) => {
        console.log("transaction done", response);

      })
      .catch(error => {
        console.log("transaction faled", error.response);

      });
  }

  retrievePaymentIntent = async (paymentIntentId: string) => {
    const paymentIntent = await retrievePaymentIntent(paymentIntentId);
    return paymentIntent;
  };

  componentDidMount() {
    this.initializePaymentSheet();
  }

  getPaymentSheetParameters = async (): Promise<PaymentSheetParams> => {
    const formattedAmount = (this.state.amount * 100).toFixed(2);
    const payload = {
      Amount: +formattedAmount,
      Currency: "AUD"
    };
    try {
      const response = await OrderService.getPaymentSheetParameters(payload);
      const { paymentIntent, ephemeralKey, customer, publishableKey } = response.data;
      return { paymentIntent, ephemeralKey, customer, publishableKey };
    } catch (error) {
      this.setState({ errorMessage: 'Payment failed.' });
      throw error;
    }
  };

  initializePaymentSheet = async () => {
    this.setState({ isLoading: true });
    try {
      const result = await this.getPaymentSheetParameters();
      this.retrievePaymentIntent(result.paymentIntent);
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Ecsatech, Inc.",
        customerId: result.customer,
        customerEphemeralKeySecret: result.ephemeralKey,
        paymentIntentClientSecret: result.paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'Jane Doe',
        },
      });
      this.setState({ isLoading: false });
    }
    catch (error) {
      this.setState({ isLoading: false });
    }
  };

  openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      this.setState({ isLoading: false, modalVisible: true, errorMessage: `Error: ${error.code}, ${error.message}` });
    } else {
      this.updateTransaction();
      this.setState({ modalVisible: true });
      setTimeout(() => {
        this.setState({ modalVisible: false });
        this.props.navigation.navigate({ name: "Tables" });
      }, 3000);
    }
  };

  successModal = () => {
    const { modalVisible, errorMessage } = this.state;
    const imageSource = errorMessage ? 'http://rechorderp.com/app/images/not-verfied.png' : 'http://rechorderp.com/app/images/verfied-tick.png';
    const textContent = errorMessage ? errorMessage : "Payment done successfully.\nRedirecting to table screen...";

    return (
      <View style={styles.backdrop}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <TouchableHighlight
            style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.60)' }}
            activeOpacity={1}
            underlayColor={"transparent"}
            onPress={() => this.setState({ modalVisible: false })}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Image
                  source={{ uri: imageSource }}
                  style={{ width: 200, height: 200, transform: [{ scale: 0.8 }] }}
                />
                <Text>{textContent}</Text>
              </View>
            </View>
          </TouchableHighlight>
        </Modal>
      </View>
    );
  };


  render() {
    return (
      <SafeAreaView>
        <View style={styles.backGround}>
          {this.state.isLoading ?
            <LoadingScreen />
            : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity>
                <Button
                  title={this.state.isLoading ? 'Loading...' : 'Pay with Stripe'}
                  onPress={this.openPaymentSheet}
                  disabled={this.state.isLoading}
                />
              </TouchableOpacity>
              <View>
                {this.successModal()}
              </View>
            </View>}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backGround: {
    backgroundColor: COLORS.PAGE_BGCOLOR,
    borderRadius: 10,
    height: '98%',
    margin: 5
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
})

