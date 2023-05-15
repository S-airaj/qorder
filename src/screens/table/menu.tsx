import { Icon } from '@rneui/base';
import React, { Component } from 'react'
import { Pressable, View, Text, Image, Dimensions, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Modal, Alert, TouchableWithoutFeedback, TextInput, TouchableHighlight } from 'react-native';
import { COLORS } from '../../constant';
import { ProductService } from '../../apiService/core';
import GloabalService from '../../apiService/globalService/GloabalService';
import { LoadingScreen } from '../../components';
import { CartManager } from '../../manager/Index';
import baseURL from '../../host/Host';

const { width, height } = Dimensions.get('window');
const cardWidth = 350;
const numColumns = Math.floor(width / cardWidth);
const tileSize = width / numColumns

interface Props {
    navigation: any;
}

interface State {
    isLoading: boolean,
    token: string,
    tableId: number,
    orderDate: string,
    products: any[],
    categoryProducts: any[];
    categories: any[],
    showAllProducts: boolean,
    initNameCategory: string,
    selectedCategory: any,
    selectedProduct: any,
    quantity: number,
    showModal: boolean,
    order: any,
    subTotal: any,
    isEmpty: boolean
}

export default class MenuScreenComponent extends React.Component<any, State> {
    cm: CartManager;
    constructor(props: any) {
        super(props);
        this.cm = new CartManager({})
        this.state = {
            isLoading: false,
            token: '',
            tableId: this.props.route.params.tableId,
            orderDate: this.props.route.params.orderDate,
            products: [],
            categoryProducts: [],
            categories: [],
            initNameCategory: 'All',
            showAllProducts: true,
            selectedCategory: null,
            selectedProduct: {},
            quantity: 0,
            showModal: false,
            order: null,
            subTotal: 0,
            isEmpty: true
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

    addProduct = (product: any, tableId: any) => {
        this.setState({ subTotal: 0 });
        const { order, quantity } = this.state;
        const { CurrentAmount, Discount, TaxCode } = product;
        var updatedOrder = order ?? {
            Date: new Date(),
            Products: [],
            Status: "NEW",
            TotalWithTax: 0,
            TotalWithoutTax: 0,
            TableId: tableId
        };
        let exists = false
        for (var _item in updatedOrder.Products) {
            console.log("exist then", updatedOrder.Products[_item], product)

            if (updatedOrder.Products[_item].BillableId === product.BillableId) {

                updatedOrder.Products[_item].Quantity = updatedOrder.Products[_item].Quantity + quantity
                exists = true
                let _total = (updatedOrder.Products[_item].CurrentAmount - updatedOrder.Products[_item].Discount) * 1
                updatedOrder.TotalWithoutTax += _total
                updatedOrder.TotalWithTax += _total * (1 + updatedOrder.Products[_item].TaxCode / 100)
            }
        }
        if (!exists) {
            var _totalWithoutTax = (product.CurrentAmount - product.Discount) * quantity
            var _totalWithTax = _totalWithoutTax * (1 + product.TaxCode / 100)
            updatedOrder.TotalWithoutTax += _totalWithoutTax
            updatedOrder.TotalWithTax += _totalWithTax
            updatedOrder.Products.push(product)
        }

        this.setState({
            quantity: 0, subTotal: updatedOrder.TotalWithTax?.toFixed(2), isEmpty: false, showModal: false, order: updatedOrder
        })

    }

    clearCarts = (tableId: any) => {
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
        this.setState({ isEmpty: true })
    }

    changeQuantity = (quantity: number) => {
        const newQuantity = this.state.quantity + quantity;
        if (newQuantity < 1) {
            return;
        }
        this.setState({ quantity: newQuantity });
    };

    showModal = (item: any) => {
        this.setState({
            selectedProduct: item,
            showModal: true,
        });
    };

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
            if (item.Billable && item.Billable.Url) {
                const staticsIndex = item.Billable.Url.indexOf('/statics/');
                if (staticsIndex !== -1) {
                    const domainkeyIndex = item.Billable.Url.indexOf(domainkey, staticsIndex);
                    if (domainkeyIndex === -1) {
                        item.Billable.Url = item.Billable.Url.replace('/statics/', '/statics/' + domainkey + '/');
                    }
                }
            }
        }

        const { wraptext, cardimage, productCard, labelfont, contentfont, addToCartButton, addToCartText } = styles;
        const uri = item.Billable?.Url
            ? { uri: item.Billable?.Url }
            : { uri: 'https://adlog.narmadeayurvedam.com/dtup/default-product.png' };
        const name = item.Billable?.Name;
        const basePrice = item.Billable?.BasePrice?.toFixed(2);
        const currencyName = item.Billable?.Currency?.Name;

        return (
            <Pressable>
                <View style={productCard}>
                    <Image source={uri} style={cardimage} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
                        <View style={wraptext}>
                            <Text style={labelfont}>{name}</Text>
                            <Text style={contentfont}>{currencyName} {basePrice}</Text>
                        </View>
                        <Pressable style={addToCartButton} onPress={() => this.showModal(item)}>
                            <Text style={addToCartText}>Add to Cart</Text>
                        </Pressable>
                    </View>
                </View>
            </Pressable>
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
            />
        );
    }

    openCart = (tableId: number) => {
        this.props.navigation.navigate({
            "name": "Cart",
            params: {
                tableId: tableId, order: this.state.order, orderDate: this.state.orderDate,
                subTotal: this.state.subTotal, isEmpty: this.state.isEmpty,
            }
        });
    }

    render() {
        const { backGround, screenHeader, screenHeaderText, menuTitle } = styles
        const { categories, products, categoryProducts, showAllProducts, tableId } = this.state
        let data = showAllProducts ? products : categoryProducts

        return (
            <SafeAreaView>
                <View style={backGround}>
                    {this.state.isLoading ?
                        <LoadingScreen />
                        : <View>
                            <View style={screenHeader}>
                                <Text style={screenHeaderText}>Table: {tableId}</Text>
                                <Pressable style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',

                                }} onPress={() => this.clearCarts(this.state.tableId)}>
                                    <Text style={screenHeaderText}> Clear All Carts</Text>
                                </Pressable>
                                <Pressable style={{ paddingRight: 10 }} onPress={() => this.openCart(this.state.tableId)}>
                                    <Text style={screenHeaderText}>Cart</Text>
                                </Pressable>
                            </View>
                            <View style={{ paddingLeft: 10, paddingRight: 10, }}>
                                <FlatList
                                    extraData={this.state.selectedCategory}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    data={categories}
                                    keyExtractor={(item) => { return item.Id.toString(); }}
                                    renderItem={this.renderCategories} />
                            </View>
                            <View>
                                <View style={styles.line}></View>
                                <Text style={menuTitle}> {this.state.initNameCategory} Items</Text>
                                {this.renderProductList(data)}
                            </View>
                            {this.state.showModal && <TouchableWithoutFeedback onPress={() => this.setState({ showModal: false })}>
                                {this.renderModal()}
                            </TouchableWithoutFeedback>}
                        </View>}
                </View>
            </SafeAreaView>
        );
    };

    renderModal = () => {
        const { selectedProduct, quantity, tableId } = this.state;
        return (
            <View style={styles.backdrop}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showModal}
                    onRequestClose={() => {
                        this.setState({ showModal: false });
                    }}
                >
                    <TouchableHighlight style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.60)' }}
                     activeOpacity={1} underlayColor={"transparent"} onPress={() => this.setState({showModal: false})}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{selectedProduct.Billable?.Name}</Text>
                            <View style={styles.modalRow}>
                                <TouchableOpacity onPress={() => this.changeQuantity(-1)}>
                                    <Text style={styles.modalButton}>-</Text>
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.quantityInput}
                                    value={String(quantity)}
                                    onChangeText={(value) => this.setState({ quantity: Number(value) })}
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity onPress={() => this.changeQuantity(1)}>
                                    <Text style={styles.modalButton}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.addToCartButton} onPress={() => this.addProduct({
                                BillableId: selectedProduct.Billable?.Id, Name: selectedProduct.Billable?.Name, Quantity: this.state.quantity, CurrentAmount: selectedProduct.Billable?.BasePrice,
                                Discount: selectedProduct.Billable?.Discount, Description: selectedProduct.Billable?.Description, Url: selectedProduct.Billable?.Url, TaxCode: selectedProduct.Billable?.TaxCode?.Value,
                            }, this.state.tableId)}>
                                <Text style={styles.addToCartText}>Add to Cart</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </TouchableHighlight>
                </Modal>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    backGround: {
        backgroundColor: COLORS.PAGE_BGCOLOR,
        borderRadius: 10,
        height: '98%',
        margin: 5
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
        paddingVertical: 8,
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
        marginTop: 10,
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
        aspectRatio: 16 / 9,
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

    addToCartButton: {
        backgroundColor: COLORS.PRIMARY,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addToCartText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },

    modalContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 10,
        maxHeight: height / 4,
        maxWidth: width * 0.8,

    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: COLORS.PRIMARY,
    },
    modalRow: {
        width: "50%",
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 16,
    },
    modalButton: {
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalContainer: {
        backgroundColor: '#1890ff',
        padding: 8,
        borderRadius: 4,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityInput: {
        backgroundColor: '#f2f2f2',
        borderRadius: 4,
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlign: 'center',
        minWidth: 50,
        maxWidth: 100,
    },

});