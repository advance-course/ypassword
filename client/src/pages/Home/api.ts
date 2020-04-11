import http from 'utils/http';
import { Page, PaginationParam } from 'hooks/usePagination/entity';

/** 查询分页列表 */
export function bookListApi(params: PaginationParam) {
  return http.get<Page<book.Item>>('book/v1/list', params);
}

/**
 * @desc 更新文章配置
 * @param {params} book.Item
 * @return string
 * */
export function bookUpdateApi(params: book.Item) {
  return http.post<string>('book/v1/update', params);
}

/** 
 * @desc 点赞 
 * @param {book_id}
 * */
export function recommendBookApi(book_id: string) {
  return http.post<string>('recommend/v1/add', {
    book_id
  })
}

export function bookSubListApi(userid: string) {
  return http.get<subscribe.Info[]>('book/v1/sbscribe/list', {
    userid
  })
}

/** 
 * @desc 新增书籍配置
 * */
export function bookAddApi(params: subscribe.Info) {
  return http.post<string>('book/v1/add', params);
}

/** 
 * @desc 通过book_id查询文章列表
 */
export function articleListByBookApi(book_id: string) {
  return http.get<article.Item[]>('article/v1/book/list', {
    book_id
  })
}