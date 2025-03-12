
import request, { AxiosResponse } from "./axiosRequest"

export interface SnippetsVo {
  title: string;
  content: string;
  category: string;
  snippetID: string;
  createAt: string;
  children: SnippetsVo[]; 
}

interface Response {
  code: number;
  data: SnippetsVo[];
}

export function fetchFolderStructureInDashBoard(): Promise<AxiosResponse<Response>> {
  return request.get('/dashboard/get-folder-structure', {
    headers: {
      token: localStorage.getItem('token') || ''
    }
  })
}