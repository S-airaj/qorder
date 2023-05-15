import baseURL from "../../host/Host";
import axios from "axios";

const getOrganizationList = () => {
    return axios.get(`${baseURL}api/Organization/GetAll`);
}

const getCategoryList = () => {
    return axios.get(`${baseURL}api/BillableCategory/GetAll`);
}

const getTaxCodeList = ( )=> {
    return axios.get(`${baseURL}api/TaxCode/GetAll`);
}

const getBillableLocationList = ( )=> {
    return axios.get(`${baseURL}api/BillableLocationList/GetAll`);
}

const getBillableList = () => {
    return axios.get(`${baseURL}api/BillableToCategoryMap/GetAll`);
}

const getInvoiceList = () => {
    return axios.get(baseURL + 'api/Invoice/GetAll');
}

const getCounterList = () => {
    return axios.get(baseURL + 'api/Counter/GetAll');
}
const GloabalService = { getCategoryList, getOrganizationList, getTaxCodeList, getBillableLocationList, 
    getBillableList, getInvoiceList, getCounterList }

export default GloabalService