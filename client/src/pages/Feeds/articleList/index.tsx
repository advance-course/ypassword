import Taro, { Config, useEffect, usePullDownRefresh, useReachBottom, useRouter } from '@tarojs/taro'
import ArticleCard from 'components/ArticleCard'
import usePagination from 'hooks/usePagination'
import { articleListApi } from 'pages/toB/articles/api'
import PaginationProvider from 'components/PaginationProvider'
import './index.scss'

export default function Bookinfo() {
  const {params} = useRouter()
  const {
    list, loading, errMsg, setIncreasing, setLoading, increasing
  } = usePagination(articleListApi, { current: 1, pageSize: 20, subscription_id: params.id})

  usePullDownRefresh(() => {
    setLoading(true)
  })

  useReachBottom(() => {
    if (!list.pagination.lastPage) {
      setIncreasing(true)
    }
  })

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: params.name
    })
  }, [])

  return (
    <PaginationProvider className="container" loading={loading} errMsg={errMsg} lastPage={!!list.pagination.lastPage} increasing={increasing}>
      {list.list.map(item => (
        <ArticleCard key={item._id} info={item} editor={false} />
      ))}
    </PaginationProvider>
  )
}

Bookinfo.config = {
  navigationBarTitleText: '订阅号',
  navigationBarBackgroundColor: '#ededed',
  backgroundColor: '#ededed',
  enablePullDownRefresh: true
} as Config