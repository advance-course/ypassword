export interface PaginationParam {
  current?: number,
  pageSize?: number,
  refreshing?: boolean,
  increasing?: boolean,
  [key: string]: any
}

export interface Page<T> {
  pageSize?: number,
  current?: number,
  lastPage?: boolean,
  total?: number,
  list: T[]
}

/**
 * 分页参数
 */
export interface Pagination {
  current: number;
  pageSize?: number;
  lastPage?: boolean;
  total?: number;
}


/** 分页数据格式 */
export interface PageData<T> {
  list: T[],
  pagination: Pagination
}

export const defPaginationParams = {
  current: 1,
  pageSize: 10
}

export function getDefPageData<T>(): PageData<T> {
  return {
    list: [],
    pagination: {
      current: 1,
      pageSize: 10,
      lastPage: false,
      total: 0
    }
  }
}

export const defPageData: PageData<any> = {
  list: [],
  pagination: {
    current: 1,
    pageSize: 10,
    lastPage: false,
    total: 0
  }
}

export function mergePagination<T>(preData: PageData<T>, incomingData: Page<T>): PageData<T> {
  if (!preData || !preData.list) {
    throw new Error('mergePagination: 当前数据格式不正确，无法进行分页合并')
  }
  if (!incomingData || !incomingData.current) {
    throw new Error('mergePagination: 传入的数据格式错误,无法进行分页合并')
  }

  if (incomingData.current == 1) {
    return  {
      list: incomingData.list || [],
      pagination: {
        current: 1,
        pageSize: incomingData.pageSize,
        lastPage: incomingData.lastPage,
        total: incomingData.total,
      }
    }
  }

  // 防止传入Observable对象
  let result = {...preData};
  // 低概率情况下同样的接口被发送了两次，为了避免合并重复数据
  if (result.pagination.current != incomingData.current) {
    let _list = result.list.concat(incomingData.list || [])
    return {
      list: _list,
      pagination: {
        current: incomingData.current,
        pageSize: incomingData.pageSize,
        lastPage: incomingData.lastPage,
        total: incomingData.total
      }
    }
  }

  return result;
}