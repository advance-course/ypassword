import http from 'utils/http'

export interface CategoryParam {
  name: string,
  imgUrl: string,
  userID: string
}

/**
 * @desc 查询分类列表
 * @param params
 */
export function queryCategoryApi(params) {
  return http.get<string>('category/list', params)
}

/**
 * @desc 添加自定义分类
 * @param {params} CategoryParam
 */
export function addCategoryApi(params: CategoryParam) {
  return http.post<string>('category/add', params)
}

/**
 * @desc 删除自定义分类
 *
 */
export function delCategoryApi(params) {
  return http.post<string>('category/del', params)
}

/**
 * @desc 编辑自定义分类
 */
export function updateCategoryApi(params) {
  return http.post<string>('category/update', params)
}
