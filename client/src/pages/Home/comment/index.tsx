import Taro, { useRouter, Config, usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import {View, ScrollView, Input, Image, Text} from '@tarojs/components'
import {AtAvatar} from 'taro-ui'
import usePagination from 'hooks/usePagination'
import PaginationProvider from 'components/PaginationProvider'
import {commentListApi} from './api'
import './index.scss'
import MyIcon from 'components/myIcon'

export default function Comment() {
  const router = useRouter()
  const {key} = router.params

  const {list, loading, errMsg, setIncreasing, setLoading, increasing} = 
  usePagination(commentListApi, {current: 1, pageSize: 20, key})

  console.log(list)

  usePullDownRefresh(() => {
    setLoading(true)
  })

  useReachBottom(() => {
    if (!list.pagination.lastPage) {
      setIncreasing(true)
    }
  })

  return (
    <PaginationProvider className="comment_container" loading={loading} errMsg={errMsg} lastPage={!!list.pagination.lastPage} increasing={increasing}>
      <View className="top_tip">
        全部评论（{list.pagination.total || 0}）
      </View>
      {list.list.map((item) => (
        <View className="comment_ctx" key={item._id}>
          <View className="cmt_left">
            <AtAvatar circle size="small" image={item.avatarUrl || ''} text={item.nickName || ''} />
          </View>
        
          <View className="cmt_right">
            <View className="top">
              <Text className="user_name">{item.nickName || ''}</Text>
            </View>
            <Text className="content">{item.content}</Text>
            <View className="bottom">
              <View className="create_time">{item.createTime}</View>

              <View className="b_right">
                <View className="like_wrap">
                  <MyIcon name="heart" size={14} />
                  <Text className="like_number">{item.like || 0}</Text>
                </View>
                <View className="cmt_wrap">
                  <MyIcon name="dialogue" size={13} />
                  <Text>{item.comment || ''}</Text>
                </View>
              </View>
              
            </View>
          </View>
        </View>
      ))}
    </PaginationProvider>
  )
}

Comment.config = {
  navigationBarTitleText: '所有评论',
  enablePullDownRefresh: true
} as Config
