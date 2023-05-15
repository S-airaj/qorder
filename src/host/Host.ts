import axios from 'axios';
import store from '../storeData/AuthStore'

const baseURL: string = 'http://rechorderp.com/'

interface Token {
  access_token: string;
  domainkey: string;
}

const header = {
  'Accept': '*/*',
  'Content-Type': 'application/x-www-form-urlencoded'
}

axios.interceptors.request.use(
  async (config: any) => {
    const token: Token = await store.getData('Token')
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token.access_token,
        'domainkey': token.domainkey
      }
    }
    else {
      config.headers = header
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default baseURL