import Taro, { Config, useEffect, usePageScroll, usePullDownRefresh, useReachBottom, useRouter } from '@tarojs/taro'
import ArticleCard from 'components/ArticleCard'
import usePagination from 'hooks/usePagination'
import { articleListApi } from 'pages/toB/articles/api'
import PaginationProvider from 'components/PaginationProvider'
import './index.scss'
import { View, Image, Text, Button } from '@tarojs/components'

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
    console.log(params)
    Taro.setNavigationBarTitle({
      title: ''
    })
  }, [])

  usePageScroll((res) => {
    if (res.scrollTop > 160) {
      Taro.setNavigationBarTitle({ title: params.name })
    }
    if (res.scrollTop <= 160) {
      Taro.setNavigationBarTitle({ title: '' })
    }
  })

  return (
    <PaginationProvider 
      className="container"
      loading={loading} 
      errMsg={errMsg} 
      lastPage={!!list.pagination.lastPage} 
      increasing={increasing}
      length={list.list.length}
    >
      <View className="info_wrap">
        <View className="info">
          <Image className="logo" src={params.logo} />
          <Text className="name">{params.name}</Text>
        </View>
        <Text className="desc">{params.desc}</Text>
        <Button className="star" onClick={() => Taro.showToast({title: '暂未开放', duration: 1500})}>关注 TA</Button>
      </View>
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