
export const URL_BASE = 'http://lnxsrvzeus.eastus.cloudapp.azure.com:3001/api/'
//export const URL_BASE = 'http://localhost:3001/api/'

export const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'access-token': localStorage.getItem('authToken'),
}

//Membresias
export const getmembershiplist = 'memberships/getmembershiplist'

//Usuarios
export const createaccount = 'user/createaccount'
export const login = 'user/login'
export const profile = 'profile/'
export const users = 'users/'
export const adduser = 'users/user/add/'
export const user = 'users/user/'


//Empresa Info
export const bankaccounts = 'company/bankaccounts'
export const clasifications = 'company/clasifications'
export const addregistry = 'company/addregistry'
export const updateregistry = 'company/updateregistry'
export const getregistries = 'company/registries/'
export const registry = 'company/registry/'
export const deleteregistry = 'company/deleteregistry/'