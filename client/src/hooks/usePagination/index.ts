import { useState, useEffect, stopPullDownRefresh } from '@tarojs/taro'
import { Result } from 'utils/http'
import { Page, PaginationParam, defPaginationParams, getDefPageData, mergePagination } from './entity'
import produce from 'immer'

type APIFunc<T, P> = (params: P) => Promise<Result<Page<T>>>

export interface FetchResult<T> {
  loading: boolean,
  errMsg: string,
  data: T
}

export default function usePagination<T>(
  api: APIFunc<T, PaginationParam>, 
  param: PaginationParam = {},
  delay?: boolean
) {
  const [state, setState] = useState({
    loading: true,
    increasing: false,
    errMsg: '',
    params: {...defPaginationParams, ...param},
    list: getDefPageData<T>()
  })
  const {loading, increasing, params, list} = state;

  useEffect(() => {
    if (!loading || delay) { return };
    fetchList();
  }, [loading, delay])

  useEffect(() => {
    const {current} = list.pagination;
    increasing && fetchList({current: current + 1})
  }, [increasing])

  function fetchList(params: PaginationParam = {}) {
    const _param = params ? setParams(params) : state.params;
    return api(_param).then(res => {
      // 利用高阶函数科里化特性，可以这样操作
      // const producer = produce(draft => {
      //   draft.list = mergePagination(list, res.data);
      //   draft.loading = false
      //   draft.increasing = false
      //   draft.errMsg = ''
      // })
      // setState(producer(state))
      setState(produce(state, (proxy: typeof state) => {
        proxy.list = mergePagination(list, res.data);
        proxy.loading = false
        proxy.increasing = false
        proxy.errMsg = ''
      }))
      stopPullDownRefresh();
    }).catch(e => {
      setState(produce(state, draft => {
        draft.errMsg = e.message
        draft.loading = false
        draft.increasing = false
      }))
      stopPullDownRefresh();
    })
  }

  function setParams(option: PaginationParam = {}, refreshing?: boolean) {
    const _param = refreshing ? {...params, ...option, ...defPaginationParams} : {...params, ...option};
    state.params = _param;
    if (refreshing) {
      setState(produce(state, df => {
        df.loading = true
      }))
    }
    return _param;
  }

  return {
    ...state,
    setLoading: (loading: boolean) => setState(produce(state, df => {
      df.loading = loading
    })),
    setIncreasing: (increasing: boolean) => setState(produce(state, df => {
      df.increasing = increasing
    })),
    setParams,
    resetParams: () => {
      setState(produce(state, df => {
        df.params = defPaginationParams
      }))
    },
    // 更新List中的某条数据
    updateList: (item: T, index: number) => {
      const nextState = produce(state, (draft: typeof state) => {
        draft.list.list[index] = item
      })
      setState(nextState)
    },
    push: (item: T) => {
      setState(produce(state, (draft: typeof state) => {
        draft.list.list.push(item)
        draft.list.pagination.total! += 1
      }))
    },
    unshift: (item: T) => {
      setState(produce(state, (draft: typeof state) => {
        draft.list.list.unshift(item)
        draft.list.pagination.total! += 1
      }))
    },
    pop: () => {
      setState(produce(state, (draft: typeof state) => {
        if (draft.list.list.length > 0) {
          draft.list.list.pop()
          draft.list.pagination.total! -= 1
        }
      }))
    },
    shift: () => {
      setState(produce(state, (draft: typeof state) => {
        if (draft.list.list.length > 0) {
          draft.list.list.shift()
          draft.list.pagination.total! -= 1
        }
      }))
    },
    splice: (start: number, number: number) => {
      setState(produce(state, (draft: typeof state) => {
        if (draft.list.list.length > 0) {
          draft.list.list.splice(start, number)
          draft.list.pagination.total! -= number
        }
      }))
    }
  }
}
