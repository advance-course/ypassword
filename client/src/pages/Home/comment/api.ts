import http from 'utils/http';
import { Page, PaginationParam } from 'hooks/usePagination/entity';

// add a new comment
export function addCommentApi(key: string, content: string) {
  return http.post<book.Comment>('comment/v1/add', {
    key, content
  })
}

// fetch comment pagination list
// params is PaginationParam with param named key,
export function commentListApi(params: PaginationParam) {
  return http.get<Page<book.Comment>>('comment/v1/list', params);
}

// update a comment
export function commentUpdateApi(params: {_id: string, content: string}) {
  return http.post<string>('comment/v1/update', params);
}

// like a comment
export function likeCommentApi(commentid: string) {
  return http.post<string>('comment/v1/like', {
    _id: commentid
  })
}

// remove a comment
export function removeCommentApi(_id: string) {
  return http.post<string>('comment/v1/remove', {
    _id
  })
}