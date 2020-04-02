import http from 'utils/http';
import { Page, PaginationParam } from 'hooks/usePagination/entity';

/** 查询分页列表 */
export function articleListApi(params: PaginationParam) {
  return http.get<Page<article.Item>>('article/v1/list', params);
}

/** 
 * @desc 新增文章配置
 * @param {params} article.Item
 * @return articleId
 * */
export function articleAddApi(params: article.Item) {
  return http.post<string>('article/v1/add', params);
}

/**
 * @desc 更新文章配置
 * @param {params} article.Item
 * @return string
 * */
export function articleUpdateApi(params: article.Item) {
  return http.post<string>('user/v1/update', params);
}
