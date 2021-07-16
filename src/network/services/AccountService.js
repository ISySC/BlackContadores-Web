import axios from 'axios'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import { URL_BASE, createaccount, login, profile, headers } from '../api'
import handlererroapi from '../handlererroapi'

Vue.use(VueAxios, axios)

export default class AccountService {
    constructor() {
    }

    //crear el usuario inicial para la empresa
    PostCreateAccount(data) {
        return axios.post(URL_BASE + createaccount, data, headers)
            .catch(error => {
                return handlererroapi(error)
            });
    }

    //Iniciar sesión
    PostLogin(data) {

        return axios.post(URL_BASE + login, data, headers)
            .catch(error => {
                return handlererroapi(error)
            });
    }

    //Recuperar datos del perfil
    GetProfile(data) {
        
        return axios.get(URL_BASE + profile, data, headers )
        .catch(error => {
            return handlererroapi(error)
        });
    }

    //Recuperar datos del perfil
    PostUpdateProfile(data) {
        
        return axios.put(URL_BASE + profile + '/' + data.companyTransID, data, headers )
        .catch(error => {
            return handlererroapi(error)
        });
    }
}