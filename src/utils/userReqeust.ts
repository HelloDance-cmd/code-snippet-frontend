
// const BASE_URL = 'http://127.0.0.1:8080'
const BASE_URL = '/api'

import axios, { type AxiosResponse } from "axios"

const request = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
})

request.interceptors.request.use(config => {
  config.headers.set("token", localStorage.getItem("token"));
  return config;
});


export function fetchUserLogin(username: string, password: string): Promise<AxiosResponse> {
  return request.post('/user/login', {
    username: username,
    password: password
  });
}

export function fetchUserRegister(username: string, password: string, email: string): Promise<AxiosResponse> {
  return request.post('/user/register', {
    "username": username,
    "password": password,
    "email": email
  });
}

export function fetchTokenIsExpired() {
  return request.get("/user/is-expired", {
    params: {
      token: localStorage.getItem("token") || '' 
    }
  });
}
