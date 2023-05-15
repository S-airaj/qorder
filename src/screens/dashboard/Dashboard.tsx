import React, { Component } from 'react'
import GloabalService from '../../apiService/globalService/GloabalService';
import store from '../../storeData/AuthStore';
import { View, ScrollView, StyleSheet, Dimensions, FlatList, SafeAreaView, Pressable } from 'react-native';
import { COLORS } from '../../constant';
import { Text } from '@rneui/base';
import { Icon } from '@rneui/themed';

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
  curTime: string | null;
  curDate: string | null;
  currency: string;
  taxCode: null | any;
  logoImage: null | any;
  organization: Array<any>;
}

export default class HomeScreen extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false,
      Token: '',
      curTime: null,
      curDate: null,
      currency: "",
      taxCode: null,
      logoImage: null,
      organization: []
    }
  }
  componentDidMount() {
    setInterval(() => (
      this.setState(
        { curTime: new Date().toLocaleTimeString(), curDate: new Date().toLocaleDateString() }
      )
    ), 1000);
    this.getOrganization()
  }

  getOrganization = () => {
    GloabalService.getOrganizationList()
      .then(response => {
        this.setState({ isLoading: false, organization: response.data.Result });
        store.storeData('Organization', response.data.Result).then(res => { })
        console.log("size", numColumns)
      })
      .catch(() => {
        this.setState({ isLoading: false });
      });
  }

  renderHomeCard = (name: string, icon: string) => (
    <Pressable style={styles.cardContainer} onPress={() => this.props.navigation.navigate({ 'name': name })}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={65} color={COLORS.WHITE} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{name}</Text>
      </View>
    </Pressable>
  );

  render() {
    return (
      <>
        <View style={styles.timeStrip}>
          <Text style={styles.dateText}>Date: {this.state.curDate}</Text>
          <Text style={styles.timeText}>Time: {this.state.curTime}</Text>
        </View>
        <SafeAreaView>
          <FlatList
            data={[
              { name: 'Tables', icon: 'question' },
              { name: 'Products', icon: 'question' },
              { name: 'Categories', icon: 'question' },
              { name: 'New Orders', icon: 'list' },
              { name: 'Order History', icon: 'history' },
              { name: 'Report', icon: 'pie-chart' },
            ]}
            keyExtractor={item => item.name}
            renderItem={({ item }) => this.renderHomeCard(item.name, item.icon)}
            numColumns={numColumns}
          />
        </SafeAreaView>
      </>

    )
  }
}

const styles = StyleSheet.create({
  homeBackground: {
    width: "100%",
    backgroundColor: COLORS.PAGE_BGCOLOR,
    borderRadius: 10,
    margin: 10,
    padding: 5
  },  

  cardContainer: {
    flex: 1,
    backgroundColor: "#ADD8E6",
    width: cardWidth,
    height: 250,
    marginBottom: 5,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 5,
    margin: 5,
    alignItems: 'center'
  },

  iconContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: 150,
    height: 150,
    backgroundColor: "#43A6C6",
    borderRadius: 100,
    borderColor: COLORS.PRIMARY,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },

  timeStrip: {
    shadowColor: '#ccc',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 5,
    backgroundColor: COLORS.PRIMARY,
    width: '100%',
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#fff'
  },

  textContainer: {
    flex: 1,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY
  },

  text: {
    fontWeight: 'bold',
    fontSize: 22,
    color: "#fff"
  },

  dateText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10
  },

  timeText: {
    fontSize: 18,
    color: '#fff',
    marginRight: 10
  },
});