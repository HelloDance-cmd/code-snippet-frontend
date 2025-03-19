
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

export type Response<T> = Promise<AxiosResponse<{status: number, data: T}>>

export default request

export type {
  AxiosResponse
}