import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions, Pressable, Alert } from 'react-native';
import { COLORS, IMAGES } from '../../constant';
import { LoadingScreen } from '../../components';
import store from '../../storeData/AuthStore';
import { Icon, Text } from "@rneui/themed";
import { SafeAreaView } from 'react-native-safe-area-context';
import GloabalService from '../../apiService/globalService/GloabalService';
import { CategoryService } from '../../apiService/core';

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
  categoryList: any[];
  errorMsg?: string;
}

export default class CategoryListScreen extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false,
      Token: '',
      categoryList: [],
    }
  }
  componentDidMount = () => {
    this.getCategoryList();
  }

  componentWillUnmount = () => {
  }

  editCategory = (Id: number) => {
    this.props.navigation.navigate({ "name": "Edit Category", params: { Id: Id } });
  }

  getCategoryList = () => {
    this.setState({ isLoading: true });
    CategoryService.getCategoryList()
      .then(response => {
        console.log(response);
        this.setState({ isLoading: false, categoryList: response.data.Result });
      })
      .catch(error => {
        this.setState({ isLoading: false, errorMsg: 'Something went wrong.' });
      });
  }

  renderCategories = ({ item }: { item: any }) => {
    return (
      <Pressable onPress={() => this.editCategory(item.Id)}>
        <View style={styles.categoriesItemContainer}>
          <View style={{
            backgroundColor: '#D6E4FF',
            width: '100%', borderRadius: 20,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0, alignItems: 'center'
          }}>
            <Image
              style={styles.categoriesPhoto}
              source={
                item.Url ? { uri: item.Url } : IMAGES.DefaultProduct
              }
            />
          </View>
          <Text style={styles.categoriesName}>{item.Name}</Text>
          <Text style={styles.categoriesInfo}>
            {`${item.ProductCount} products`}
          </Text>
        </View>
      </Pressable>
    );
  };

  add = () => {
    this.props.navigation.navigate({ 'name': 'Add Category' })
  };

  render() {
    const { isLoading } = this.state;
    return (
      <SafeAreaView>
        <View style={{ backgroundColor: COLORS.PAGE_BGCOLOR, borderRadius: 10, margin: 10, height: '98%' }}>
        {isLoading ? <LoadingScreen /> :
          <FlatList
            numColumns={numColumns}
            showsVerticalScrollIndicator={true}
            data={this.state.categoryList}
            keyExtractor={(item, index) => { return item.Id.toString(); }}
            renderItem={this.renderCategories}
          />
        }
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={this.add}
          style={styles.touchableOpacityStyle}>
          <Image

            source={{
              uri:
                'https://cdn.pixabay.com/photo/2017/03/19/03/51/material-icon-2155448_960_720.png',
            }}
            style={styles.floatingButtonStyle}
          />
        </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  categoriesItemContainer: {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#cccccc',
    borderWidth: 0.5,
    borderRadius: 20,
    width: tileSize * 0.9,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 3,
    backgroundColor: '#fff1d6'
  },

  categoriesPhoto: {
    margin: 5,
    width: '50%',
    height: tileSize / 3,
    borderRadius: tileSize / 3,
    overflow: 'hidden',
    shadowColor: '#cccc',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
  },

  categoriesName: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    marginTop: 8
  },

  categoriesInfo: {
    marginTop: 3,
    marginBottom: 5
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