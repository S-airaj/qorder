import axios from "axios";
import baseURL from "../../host/Host";

const getOrderList = (payload: any) => {
    return axios.post(baseURL + 'api/Invoice/GetInvocieWithServiceLocation/', payload);
}

const addToOrder = (payload: any) => {
    return axios.post(`${baseURL}api/BillableToCategoryMap/Add`, payload);
}

const getOrderProductsForOrder = (Id: number) => {
    return axios.get(`${baseURL}api/OrderProduct/GetOrderProductForOrder/?Id=` + Id);
}

const getActiveOrders = (Id: number) => {
    return axios.get(`${baseURL}api/Order/GetActiveOrder/?Id=` + Id);
}

const createOrder = (payload: any) => {
    return axios.post(`${baseURL}api/ServiceLocation/CreateOrderForTable/`, payload);
}

const createPayment = (payload: any)=> {
    return axios.post(`${baseURL}api/Transaction/CreatePayment/`, payload);
}

const getPaymentSheetParameters = (payload: any) => {
    return axios.post(`${baseURL}api/Transaction/PaymentSheet/`, payload);
}

const updateTransaction = (Id: number)=> {
    return axios.get(`${baseURL}api/Transaction/CreateTransactionForOrder/?Id=` + Id);
}

const OrderService = { getOrderList, addToOrder, createOrder, getOrderProductsForOrder, getActiveOrders, 
    createPayment, getPaymentSheetParameters, updateTransaction }

export default OrderService