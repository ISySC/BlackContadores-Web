import axios from 'axios'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import { URL_BASE, bankaccounts, clasifications, addregistry, getregistries, registry, updateregistry, deleteregistry } from '../api'
import handlererroapi from '../handlererroapi'

Vue.use(VueAxios, axios)

export default class CompanyService {

    constructor() {
        axios.defaults.headers.common['access-token'] = localStorage.getItem('authToken');
    }

    GetBankaccounts(value) {

        var data = {
            companyTransID: value,
        };

        return axios.post(URL_BASE + bankaccounts, data)
            .catch(error => {
                return handlererroapi(error)
            });
    }

    PostUpdateRegistryTransaction(data) {
        return axios.put(URL_BASE + updateregistry, data)
            .catch(error => {
                return handlererroapi(error)
            });
    }

    PostRegistryTransaction(data) {

        return axios.post(URL_BASE + addregistry, data)
            .catch(error => {
                return handlererroapi(error)
            });
    }

    PostDeleteRegistryTransaction(data) {

        return axios.put(URL_BASE + deleteregistry, data)
            .catch(error => {
                return handlererroapi(error)
            });
    }

    GetRegistriesTransaction(data) {
        return axios.post(URL_BASE + getregistries, data)
            .catch(error => {
                return handlererroapi(error)
            });
    }

    GetRegistryTransaction(data) {
        return axios.get(URL_BASE + registry + data.folioID)
            .catch(error => {
                return handlererroapi(error)
            });
    }

    GetClasifications() {

        return axios.get(URL_BASE + clasifications)
            .catch(error => {
                return handlererroapi(error)
            });
    }

    GetRegistriesTransactionResults(data) {
 
        return axios.post(URL_BASE + getregistries + data.empresaTransID, data)
            .catch(error => {
                return handlererroapi(error)
            });
    }
}