import http from 'utils/http';
import { Page, PaginationParam } from 'hooks/usePagination/entity';

/** 查询分页列表 */
export function bookListApi(params: PaginationParam) {
  return http.get<Page<book.Item>>('book/v1/list', params);
}

/** 
 * @desc 新增书籍
 * @param {params} book.Item
 * @return bookId
 * */
export function bookAddApi(params: book.Item) {
  return http.post<string>('book/v1/add', params);
}

/**
 * @desc 更新文章配置
 * @param {params} book.Item
 * @return string
 * */
export function bookUpdateApi(params: book.Item) {
  return http.post<string>('user/v1/update', params);
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