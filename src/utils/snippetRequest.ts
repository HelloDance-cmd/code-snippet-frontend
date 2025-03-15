
import request, { type Response } from "./axiosRequest";



export function fetchSnippetWhichHasChildren(): Response<string[]> {
  return request.post("/snippet/directories")
}