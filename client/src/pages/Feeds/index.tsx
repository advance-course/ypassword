import Taro, { useEffect } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { useSelector, useDispatch } from '@tarojs/redux'
import { FeedsState } from 'pages/Feeds/model'
import { PaginationParam } from 'hooks/usePagination/entity'
import './index.scss'

export default function Feeds() {
  const dispatch = useDispatch()
  const feeds = useSelector<any, FeedsState>(state => state.feeds)
  const {list} = feeds
  
  useEffect(() => {
    if (!list.list.length) {
      const def: PaginationParam = {pageSize: 20, current: 1}
      dispatch({
        type: 'feeds/fetchList',
        payload: def
      })
    }
  }, [])
  
  return (
    <View className="container">
      {list.list.map(item => (
        <View className="gzh_card" key={item._id} onClick={() => Taro.navigateTo({ url: `/pages/Feeds/articleList/index?id=${item._id}&name=${item.name}&logo=${item.logo}&desc=${item.desc}`})}>
          <View className="left">
            <Image className="logo" src={item.logo!} />
          </View>

          <View className="right">
            <View className="name">{item.name}</View>
            <View className="desc">{item.desc}</View>
          </View>
        </View>
      ))}
    </View>
  )
}