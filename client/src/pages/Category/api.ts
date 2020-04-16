import http from 'utils/http'

/**
 * @desc 查询分类列表
 * @param params
 */
export function queryCategoryListApi(params: {userid: string, type: string}) {
  return http.get<string>('category/v1/list', params)
}

/**
 * @desc 添加自定义分类
 * @param {params} category.Info
 */
export function addCategoryApi(params: category.Info) {
  return http.post<string>('category/v1/add', params)
}

/**
 * @desc 删除自定义分类
 *
 */
export function delCategoryApi(_id: string) {
  return http.post<string>('category/v1/del', {_id})
}

/**
 * @desc 编辑自定义分类
 */
export function updateCategoryApi(params: category.Info) {
  return http.post<null>('category/v1/update', params)
}

/**
 * @desc 查询指定分类项，基本不会使用
 */
export function queryTheCategoryApi(_id: string) {
  return http.post<string>('category/query', {_id})
}
