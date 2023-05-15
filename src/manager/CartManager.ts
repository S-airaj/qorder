import { Alert } from 'react-native';
import OrderStore from '../storeData/OrderStore';
import React from 'react';

interface Props {

}

interface State {
    
}

export default class Cart extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);
    }

    getAllCartsForTableId = (tableId: number) => {
        return OrderStore.getData("Order_" + tableId)
    }

    getTablesCartForOrderDate = (tableId: number, orderDate: string) => {
        if (orderDate) {
            return OrderStore.getData("Order_" + tableId)
        }
        else {
            return
        }
    }

    storeDataForCart = (tableId: number, data: any) => {
        console.log("final svaing cart in store", tableId, data);
        OrderStore.storeData("Order_" + tableId, data)
    }

    checkIfCartExistsForTable = (tableId: number) => {
        return this.getAllCartsForTableId(tableId).then(res => {
            if (res !== null) {
                return true
            }
            else {
                return false
            }
        });

    }

    clearCartsForTable = (tableId: number) => {
        return this.storeDataForCart(tableId, null);
    }

    clearCart = (tableId: number, orderDate: string) => {
        return this.getAllCartsForTableId(tableId).then(res => {
            if(res){
            res[orderDate].Products = []
            res[orderDate].TotalWithTax = 0
            res[orderDate].TotalWithoutTax = 0
            this.storeDataForCart(tableId, res)
            }

        })
    }

    addNewCartForTable = (tableId: number, orderDate: string) => {
        return this.getAllCartsForTableId(tableId).then(response => {
            if (response == null || response[orderDate] == null) {
                let Order = {
                    Date: orderDate,
                    Products: [],
                    Status: "NEW",
                    TotalWithTax: 0,
                    TotalWithoutTax: 0,
                    TableId: tableId
                }
                response = response ? response : {};
                response[orderDate] = Order;
            }
            this.storeDataForCart(tableId, response)
        })

    }

    addProductForCart = (product:any, tableId: number, orderDate: string) => {
        return this.getAllCartsForTableId(tableId).then(response => {
            if (response[orderDate]) {
                let Order = response[orderDate]
                let cart = Order.Products
                let exists = false
                for (var _item in cart) {
                    if (cart[_item].ProductId === product.ProductId) {
                        cart[_item].Quantity = cart[_item].Quantity + 1
                        exists = true
                        let _total = (cart[_item].CurrentAmount - cart[_item].Discount) * 1
                        Order.TotalWithoutTax += _total
                        Order.TotalWithTax += _total * (1 + cart[_item].TaxCode / 100)
                    }
                }
                if (!exists) {
                    var _totalWithoutTax = (product.CurrentAmount - product.Discount) * product.Quantity
                    var _totalWithTax = _totalWithoutTax * (1 + product.TaxCode / 100)
                    Order.TotalWithoutTax += _totalWithoutTax
                    Order.TotalWithTax += _totalWithTax
                    cart.push(product)
                }
                Order.Products = cart;
                response[orderDate] = Order;
                this.storeDataForCart(tableId, response)
            }
        })

    }

    refreshCart = (tableId: number, orderDate: string) => {
        return this.getAllCartsForTableId(tableId).then(response => {
            if (response == null || response[orderDate] == null) {
                return false
            }
            else {
                let order = response[orderDate]
                let productarray = order.Products
                if (productarray !== null) {
                    return response[orderDate]
                }
                else {
                    return false
                }
            }
        })
    };

    removeCartForTable = (tableId: number, orderDate: string) => {
       return this.getAllCartsForTableId(tableId).then(response => {
               let cartDates = []
                 cartDates = Object.keys(response)
                for (var i = 0; i < cartDates.length; i++) {
                    let cart = response[cartDates[i]]
                    if (cart.Products.length == 0) {
                        cartDates.splice(i, 1)
                        this.storeDataForCart(tableId, response)
                    }
                }
        })
    }

    checkIfEmpty = (tableId: number, orderDate: string) => {
        return this.getAllCartsForTableId(tableId).then(res0 => {
            let cart = res0[orderDate].Products
            if (cart.length == 0) {
                return true
            }
            else {
                return false
            }
        });
    }

    addItem = (Id: number, cart: any, tableId: number, orderDate: string) => {
        const cartdata = cart.Products
        for (var item in cartdata) {
            if (cartdata[item].ProductId == Id) {
                cartdata[item].Quantity = cartdata[item].Quantity + 1
                var total = (cartdata[item].CurrentAmount - cartdata[item].Discount) * cartdata[item].Quantity
                var tax = total * (1 + cartdata[item].TaxCode / 100)
                cart.TotalWithoutTax += total
                cart.TotalWithTax += tax
                this.getAllAsyncData();
                this.getAllCartsForTableId(tableId).then(response => {
                    response[orderDate] = cart;
                    this.storeDataForCart(tableId, response)
                })
            }
        }
        return this.getAllCartsForTableId(tableId)
    };

    getAllAsyncData = () => {
        try {
            const data =  OrderStore.getAllData();
            return data;
          } catch (error) {
            console.error(error)
          }
    }


    removeItem = (Id: number, cart: any, tableId: number, orderDate: string) => {
        const cartdata = cart.Products
        let _index = 0;
        for (var item in cartdata) {
            if (cartdata[item].ProductId == Id) {
                var total = (cartdata[item].CurrentAmount - cartdata[item].Discount) * 1
                var tax = total * (1 + cartdata[item].TaxCode / 100)
                if (cartdata[item].Quantity == 1) {
                    cartdata.splice(_index, 1)
                    this.checkIfEmpty(tableId ,orderDate)
                }
                else {
                    cartdata[item].Quantity = cartdata[item].Quantity - 1
                }
                cart.TotalWithoutTax -= total
                cart.TotalWithTax -= tax
                this.getAllCartsForTableId(tableId).then(response => {
                    response[orderDate] = cart;
                    this.storeDataForCart(tableId, response)
                })
            }
            _index++;
        }
        return this.getAllCartsForTableId(tableId)
    };

    deleteItem = (Id: number, cart: any, tableId: number, orderDate: string) => {
        const cartdata = cart.Products
        let _index = 0;
        for (var item in cartdata) {
            if (cartdata[item].ProductId === Id) {
                var total = (cartdata[item].CurrentAmount - cartdata[item].Discount) * cartdata[item].Quantity
                var tax = total * (1 + cartdata[item].TaxCode / 100)
                if (cartdata[item].Quantity >= 1) {
                    cartdata.splice(_index, 1)
                    // this.checkIfEmpty(tableId: number, orderDate: string)
                }
                cart.TotalWithoutTax -= total
                cart.TotalWithTax -= tax
                this.getAllCartsForTableId(tableId).then(response => {
                    response[orderDate] = cart;
                    this.storeDataForCart(tableId, response)
                })
            }
            _index++;
        }
        return this.getAllCartsForTableId(tableId)
    };
}
