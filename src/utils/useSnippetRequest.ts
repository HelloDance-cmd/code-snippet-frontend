
import request, { type Response } from "./useAxiosRequest";


export type TDirectory = {
  id: string,
  name: string
}

export function fetchSnippetDirectories(): Response<TDirectory[]> {
  return request.post("/snippet/directories")
}

export function fetchSnippetDelete(id: string) {
  return request.get('/snippet/remove', {
    params: {
      id
    }
  })
}

