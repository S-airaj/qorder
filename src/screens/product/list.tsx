import React from 'react'
import { Alert, Dimensions, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ProductService } from '../../apiService/core';
import GloabalService from '../../apiService/globalService/GloabalService';
import { COLORS } from '../../constant';
import { LoadingScreen } from '../../components';
import { lightColors } from '@rneui/base';
import baseURL from "../../host/Host";


const { width, height } = Dimensions.get('window');
const cardWidth = 350;
const numColumns = Math.floor(width / cardWidth);
const tileSize = width / numColumns

interface Props {
  navigation: any;
}

interface State {
  isLoading: boolean,
  Token: string,
  refresh: boolean,
  products: any[],
  categoryProducts: any[],
  categories: any[],
  initNameCategory: string
  showAllProducts: boolean,
  selectedCategory: any,
}

export default class ProductListScreen extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false,
      Token: '',
      refresh: false,
      products: [],
      categoryProducts: [],
      categories: [],
      initNameCategory: 'All',
      showAllProducts: true,
      selectedCategory: null,
    };
  }

  componentDidMount() {
    this.getCategoryList();
    this.getProductList();
  }

  getCategoryList = () => {
    this.setState({ isLoading: true });
    GloabalService.getCategoryList()
      .then(response => {
        response.data.Result.splice(0, 0, { Name: 'All Items', Id: -1 });
        this.setState({ isLoading: false, selectedCategory: -1, categories: response.data.Result });
      })
      .catch(error => {
        this.setState({ isLoading: false });
      });
  };

  getProductList = () => {
    this.setState({ isLoading: true });
    GloabalService.getBillableList()
      .then(response => {
        this.setState({ isLoading: false, products: response.data.Result });
      })
      .catch(error => {
        this.setState({ isLoading: false });
      });
  };

  getProductForCategory = (Id: number, Name: string) => {
    this.setState({ isLoading: true });
    if (Id == -1) {
      this.showAllProducts();
      return;
    }
    this.setState({ selectedCategory: Id });
    ProductService.getProductForCategory(Id)
      .then(response => {
        this.setState({ isLoading: false, categoryProducts: response.data.Result, initNameCategory: Name, showAllProducts: false });
      })
      .catch(error => {
        this.setState({ isLoading: false });
      });
  };

  showAllProducts = () => {
    this.setState({ showAllProducts: true, selectedCategory: -1, initNameCategory: "All" })
    this.getProductList();
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


  renderCategories = ({ item, index }: { item: any; index: number }) => {
    const { categoryMenuCard, cardtext } = styles;
    const { selectedCategory } = this.state;
    const backgroundColor =
      selectedCategory === item.Id ? COLORS.PRIMARY : COLORS.WHITE;
    const textColor =
      selectedCategory === item.Id ? COLORS.WHITE : COLORS.PRIMARY;

    return (
      <Pressable onPress={() => this.getProductForCategory(item.Id, item.Name)}>
        <View style={[categoryMenuCard, { backgroundColor }]}>
          <Text style={[cardtext, { color: textColor }]}>{item.Name}</Text>
        </View>
      </Pressable>
    );
  };

  renderProducts = ({ item, index }: { item: any; index: number }) => {
    if (baseURL == 'http://rechorderp.com/') {
      var domainkey = 'a4120544-5fa5-4d96-bc01-623435e258ec';
      console.log("first", item.Billable.Url);
      if (item.Billable && item.Billable.Url) {
        const staticsIndex = item.Billable.Url.indexOf('/statics/');
        if (staticsIndex !== -1) {
          const domainkeyIndex = item.Billable.Url.indexOf(domainkey, staticsIndex);
          console.log("index", staticsIndex, domainkeyIndex);
          if (domainkeyIndex === -1) {
            item.Billable.Url = item.Billable.Url.replace('/statics/', '/statics/' + domainkey + '/');
          }
        }
      }
      console.log("second", item.Billable.Url);
    }

    const { wraptext, cardimage, productCard, labelfont, contentfont } = styles;
    const uri = item.Billable?.Url
      ? { uri: item.Billable?.Url }
      : { uri: 'https://adlog.narmadeayurvedam.com/dtup/default-product.png' };
    const name = item.Billable?.Name;
    const basePrice = item.Billable?.BasePrice?.toFixed(2);
    const currencyName = item.Billable?.Currency?.Name;

    return (
      <View style={{ flex: 1 }}>
        <Pressable onPress={() => this.edit(item.Id)}>
          <View style={productCard}>
            <Image source={uri} style={cardimage} />
            <View style={wraptext}>
              <Text style={labelfont}>{name}</Text>
              <Text style={contentfont}>{currencyName} {basePrice}</Text>
            </View>
          </View>
        </Pressable></View>
    );
  };

  renderProductList = (data: any) => {
    return (
      <FlatList
        numColumns={numColumns}
        showsVerticalScrollIndicator={true}
        data={data}
        keyExtractor={(item, index) => {
          return item.Id.toString();
        }}
        renderItem={this.renderProducts}
        contentContainerStyle={{ padding: 10 }}
      />
    );
  }

  render() {
    const { backGround, menuTitle } = styles;
    const { categories, products, categoryProducts, showAllProducts } = this.state;

    return (
      <SafeAreaView>
        <View style={backGround}>
          {this.state.isLoading ?
            <LoadingScreen />
            : <>
              <View>
                <View>
                  <FlatList
                    pagingEnabled
                    extraData={this.state.selectedCategory}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    keyExtractor={(item, index) => {
                      return item.Id.toString();
                    }}
                    renderItem={this.renderCategories}
                    contentContainerStyle={{ padding: 10 }}
                  />
                </View>
                <View>
                  <View style={styles.line}></View>
                  <Text style={menuTitle}> {this.state.initNameCategory} Items</Text>
                  {this.renderProductList(this.state.showAllProducts ? products : categoryProducts)}
                </View>
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
              </TouchableOpacity>
            </>}
        </View>
      </SafeAreaView>
    );

  }
};

const styles = StyleSheet.create({
  backGround: {
    backgroundColor: COLORS.PAGE_BGCOLOR,
    borderRadius: 10,
    height: '98%',
    margin: 5
  },
  menuTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 16,
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.PRIMARY,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    marginHorizontal: 20,
    alignSelf: 'center',
    width: '90%',
  },
  cardtext: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoryMenuCard: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 12,
    borderColor: COLORS.PRIMARY
  },
  content: {
    padding: 10
  },
  productCard: {
    backgroundColor: COLORS.SECONDARY,
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

  cardimage: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: '100%',
    aspectRatio: 16/9,
    resizeMode: 'contain',
  },

  wraptext: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  labelfont: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    lineHeight: 16,
    color: COLORS.PRIMARY,
  },
  contentfont: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.GRADIENT_END,
    marginTop: 4,
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