import axios from 'axios'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import { URL_BASE, bankaccounts, clasifications, addregistry, getregistries, registry, headers, updateregistry } from '../api'
import handlererroapi from '../handlererroapi'

Vue.use(VueAxios, axios)

export default class CompanyService {
    constructor() {
    }

    GetBankaccounts(value) {
        let data = {
            companyTransID: value,
        };

        return axios.post(URL_BASE + bankaccounts, data, headers)
            .catch(error => {
                return handlererroapi(error)
            });
    }

    PostUpdateRegistryTransaction(data) {
        return axios.put(URL_BASE + updateregistry, data, headers)
            .catch(error => {
                return handlererroapi(error)
            });
    }
    
    PostRegistryTransaction(data) {
        return axios.post(URL_BASE + addregistry , data, headers)
            .catch(error => {
                return handlererroapi(error)
            });
    }

    GetRegistriesTransaction(data) {
        return axios.post(URL_BASE + getregistries, data, headers)
            .catch(error => {
                return handlererroapi(error)
            });
    }

    GetRegistryTransaction(data) {
        return axios.get(URL_BASE + registry + data.folioID, headers)
            .catch(error => {
                return handlererroapi(error)
            });
    }   

    GetClasifications() {
        return axios.get(URL_BASE + clasifications, headers)
            .catch(error => {
                return handlererroapi(error)
            });
    }
}