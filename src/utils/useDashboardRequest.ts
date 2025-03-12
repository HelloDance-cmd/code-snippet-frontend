
import request, { AxiosResponse } from "./axiosRequest"

export interface SnippetsVo {
  title: string;
  content: string;
  category: string;
  snippetID: string;
  createAt: string;
  children: SnippetsVo[]; 
}

type Response<T> = Promise<AxiosResponse<{status: number, data: T}>>


export function fetchFolderStructureInDashBoard(): Response<SnippetsVo[]> {
  return request.get('/dashboard/get-folder-structure')
}


export function fetchSnippetContentChange(id: string, content: string): Response<boolean> {
  return request.post('/dashboard/snippetContentUpdate', {
    id, content
  })
}