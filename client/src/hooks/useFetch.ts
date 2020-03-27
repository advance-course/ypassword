import {useState, useEffect} from '@tarojs/taro'
import {Result} from 'utils/http'

type APIFunc<T, P> = (params: P) => Promise<Result<T>>

export interface FetchResult<T> {
  loading: boolean,
  errMsg: string,
  data: T
}

export default function useFetch<T, P>(api: APIFunc<T, P>, params: P, data: T, ) {
  const [result, setResult] = useState<FetchResult<T>>({loading: true, errMsg: '', data});
  const {loading} = result;

  useEffect(() => {
    if (loading) {
      api(params).then(res => {
        setResult({
          data: res.data,
          loading: false,
          errMsg: '',
        })
      }).catch(e => {
        setResult({
          errMsg: e.message,
          data,
          loading: false
        })
      })
    }
  }, [loading])

  return {
    ...result,
    setLoading: (loading: boolean) => setResult({...result, loading})
  }
}