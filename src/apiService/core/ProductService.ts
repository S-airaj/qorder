import axios from "axios";
import baseURL from "../../host/Host";

const getProductForCategory = (Id: number) => {
    return axios.get(`${baseURL}api/BillableToCategoryMap/GetProductForCategory/Id?=` + Id);
}

const getProductDetails = (Id: number) => {
    return axios.get(`${baseURL}api/BillableToCategoryMap/Get/?Id=` + Id);
}

const addProduct = (payload: any) => {
    return axios.post(`${baseURL}api/Billable/CreateProduct`, payload);
}

const editProduct = (payload: any) => {
    return axios.post(`${baseURL}api/Billable/EditProduct/`, payload);
}

const ProductService = { getProductDetails, addProduct, editProduct, getProductForCategory }
  
export default ProductService
