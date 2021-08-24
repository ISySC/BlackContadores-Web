import axios from 'axios'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import { URL_BASE, bankaccounts, bankaccount, clasifications, addregistry, 
        getregistries, registry, updateregistry, deleteregistry, addaccount, 
        updateaccount, subclasifications, subclasification, collection, collections  } from '../api'
import handlererroapi from '../handlererroapi'

Vue.use(VueAxios, axios)

export default class CompanyService {

    constructor() {
        axios.defaults.headers.common['access-token'] = localStorage.getItem('authToken');
    }

    //Cuentas
    GetTypeAccount()
    {
        return axios.get(URL_BASE + 'company/typeofaccount')
        .catch(error => {
            return handlererroapi(error)
        });
    }

    //Cxc and Cxp
    GetCollections(data) {

        return axios.post(URL_BASE + collection, data)
            .catch(error => {
                return handlererroapi(error)
            });
    }

    PostCollection(data) {

        return axios.post(URL_BASE + collections, data)
            .catch(error => {
                return handlererroapi(error)
            });
    }
    
    //SubClasificaciones
    GetSubclasifications(data) {

        return axios.post(URL_BASE + subclasifications, data)
            .catch(error => {
                return handlererroapi(error)
            });
    }

    PostSubclasifications(data) {

        return axios.post(URL_BASE + subclasification, data)
            .catch(error => {
                return handlererroapi(error)
            });
    }

    PostUpdateSubclasifications(data) {

        return axios.put(URL_BASE + subclasification, data)
            .catch(error => {
                return handlererroapi(error)
            });
    }
    //
    GetBankaccounts(data) {

        return axios.post(URL_BASE + bankaccounts, data)
            .catch(error => {
                return handlererroapi(error)
            });
    }

    PostCuenta(data) {

        return axios.post(URL_BASE + addaccount, data)
            .catch(error => {
                return handlererroapi(error)
            });
    }

    PostUpdateCuenta(data) {
        console.log(data);
        return axios.put(URL_BASE + updateaccount + data.cuentaID, data)
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

    GetBankaccount(data) {
        return axios.get(URL_BASE + bankaccount + data.cuentaID)
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