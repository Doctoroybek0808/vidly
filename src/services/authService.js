import axios from 'axios'
import {apiUrl} from '../config.json'
import jwtDecode from 'jwt-decode'

const apiEndpoint = apiUrl + "/auth"
const tokenKey = "token";
export async function login(email, password){
    const {data:jwt} = await axios.post(apiEndpoint, {email, password})
    localStorage.setItem(tokenKey,jwt )
}
export function logout(){
    localStorage.removeItem(tokenKey)
}
export function loginWithJwt(jwt){
    localStorage.setItem(tokenKey,jwt )
}
export function getCurrentUser(){
    try{
        const jwt = localStorage.getItem("token");
        return jwtDecode(jwt);       
        }catch(ex){
            
        return null;
        }
}
export default{
    login,
    logout,
    getCurrentUser,
    loginWithJwt
}