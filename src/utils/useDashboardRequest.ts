
import request, { type Response } from "./useAxiosRequest"

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