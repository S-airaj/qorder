import axios from "axios";
import baseURL from "../../host/Host";

const getTableList = () => {
    return axios.get(`${baseURL}api/ServiceLocation/GetAll`);
}

const TableService = { getTableList }

export default TableService