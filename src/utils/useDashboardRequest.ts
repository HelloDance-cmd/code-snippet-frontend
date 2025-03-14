
import request, { AxiosResponse } from "./axiosRequest"

export interface SnippetsVo {
  title: string;
  content: string;
  category: string;
  snippetID: string;
  createAt: string;
  children: SnippetsVo[]; 
}

export interface SimpleSnippet {
  parentId: string | null,
  title: string,
}

type Response<T> = Promise<AxiosResponse<{status: number, data: T}>>


export function fetchFolderStructureInDashBoard(): Response<SnippetsVo[]> {
  return request.get('/dashboard/get-folder-structure')
}


export function fetchSnippetContentChange(id: string, content: string, category: string): Response<boolean> {
  //@ts-ignore
  category = category.value;
  return request.post('/dashboard/snippetContentUpdate', {
    id, content, language: category
  })
}

export function fetchCreateSnippet(snippet: SimpleSnippet): Response<boolean> {
  return request.post('/dashboard/createNewSnippet', {
    ...snippet
  })
}

export function fetchCategoriesOfSnippet(): Response<string[]> {
  return request.get('/dashboard/getCategories');
}