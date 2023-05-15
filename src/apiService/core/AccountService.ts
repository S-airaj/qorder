import baseURL from "../../host/Host";
import axios from "axios";

interface Token {
  access_token: string;
  domainkey: string;
}

interface LoginData {
  username: string;
  password: string;
}

const login = async (data: LoginData) => {
    return await axios.post(`${baseURL}directoauth/token`, data);
};

const roleAuth = async (data: LoginData, token: Token) => {
    return await axios.post(`${baseURL}oauth2/token`, data, {
        headers: {
            Accept: '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + token.access_token,
            domainkey: token.domainkey
        },
    });
};

const getRole = async () => {
    return  await axios.get(`${baseURL}api/intuserStage/GetRoleMap/`);
};

const AccountService = { login, roleAuth, getRole };

export default AccountService;
