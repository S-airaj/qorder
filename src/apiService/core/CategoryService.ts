    import baseURL from "../../host/Host";
    import axios from "axios";

    const addCategory = (payload: any) => {
        return axios.post(`${baseURL}api/BillableCategory/add`, payload);
    }

    const editCategory = (payload: any) => {
        return axios.post(`${baseURL}api/BillableCategory/edit`, payload);
    }

    const getCategory = (Id: number) => {
        return axios.get(`${baseURL}api/BillableCategory/Get/?Id=` + Id);
    }

    const getCategoryList = () => {
        return axios.get(`${baseURL}api/BillableToCategoryMap/GetCategoryListWithProductCount`);
    }

    const CategoryService = { addCategory, editCategory, getCategory, getCategoryList }

    export default CategoryService