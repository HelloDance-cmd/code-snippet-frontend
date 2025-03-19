

import request, { type AxiosResponse, type Response } from "./useAxiosRequest"

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
  if (localStorage.getItem('token') == null) {
    return Promise.resolve({
      data: {
        data: 'Token 是空的'
      },
      status: 401
    })
  }

  return request.get("/user/isExpired", {
    params: {
      token: localStorage.getItem("token") || '' 
    }
  });
}


export interface WhoAmIResponse {
  username: string,
  email: string
}
export function fetchWhoAmI(): Promise<AxiosResponse<{ code: number, data: WhoAmIResponse }>> {
  return request.post("/user/whoami");
}

type Possible = {"登录": Date} | {"登出": Date}
export type LoginRecoredType = Possible[]
export function fetchLoginRecord(): Response<LoginRecoredType> {
  return request.post("/user/loginLogs")
}