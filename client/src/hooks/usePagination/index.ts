import { useState, useEffect, stopPullDownRefresh } from '@tarojs/taro'
import { Result } from 'utils/http'
import { Page, PaginationParam, defPaginationParams, defPageData, PageData, mergePagination } from './entity'

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
  const a = 10;
  const b = 10;
  const [state, setState] = useState({
    loading: true,
    increasing: false,
    errMsg: '',
    params: {...defPaginationParams, ...param},
    list: defPageData as PageData<T>
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

  function dispatch(option: any) {
    setState({...state, ...option});
  }

  function fetchList(params: PaginationParam = {}) {
    const _param = params ? setParams(params) : state.params;
    return api(_param).then(res => {
      dispatch({
        list: mergePagination(list, res.data),
        loading: false,
        refreshing: false,
        increasing: false,
        errMsg: ''
      })
      stopPullDownRefresh();
    }).catch(e => {
      dispatch({
        errMsg: e.message,
        loading: false,
        refreshing: false,
        increasing: false
      })
      stopPullDownRefresh();
    })
  }

  function setParams(option: PaginationParam = {}, refreshing?: boolean) {
    const _param = refreshing ? {...params, ...option, ...defPaginationParams} : {...params, ...option};
    state.params = _param;
    if (refreshing) {
      dispatch({ loading: true })
    }
    return _param;
  }

  function resetParams() {
    dispatch({params: defPaginationParams});
  }

  return {
    ...state,
    setLoading: (loading: boolean) => dispatch({loading}),
    setIncreasing: (increasing: boolean) => dispatch({increasing}),
    setParams,
    resetParams
  }
}