import Taro, { useRouter, Config, usePullDownRefresh, useReachBottom, useState } from '@tarojs/taro'
import {View, Input, Text, Button, Image } from '@tarojs/components'
import moment from 'moment'
import usePagination from 'hooks/usePagination'
import PaginationProvider from 'components/PaginationProvider'
import {commentListApi, addCommentApi} from './api'
import MyIcon from 'components/myIcon'
import './index.scss'

export default function Comment() {
  const router = useRouter()
  const {key} = router.params
  const [commentText, setCommentText] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)

  const {list, loading, errMsg, setIncreasing, setLoading, increasing, unshift} = 
  usePagination(commentListApi, {current: 1, pageSize: 20, key})

  usePullDownRefresh(() => {
    setLoading(true)
  })
 
  useReachBottom(() => {
    if (!list.pagination.lastPage) {
      setIncreasing(true)
    }
  })

  function commentSure() {
    setCommentLoading(true)
    addCommentApi(key, commentText).then((res) => {
      // 思考：如果要做回显，这里的数据为什么由接口提供更好
      unshift(res.data);
      Taro.showToast({ title: '评论成功', icon: 'success'})
      setCommentText('')
      setCommentLoading(false)
    }).catch(e => {
      Taro.showToast({title: e.message, icon: 'none'})
      setCommentLoading(false)
    })
  }

  return (
    <PaginationProvider className="comment_container" loading={loading} errMsg={errMsg} lastPage={!!list.pagination.lastPage} increasing={increasing}>
      <View className="top_tip">
        共 {list.pagination.total || 0} 条评论
      </View>
      {list.list.map((item) => (
        <View className="comment_ctx" key={item._id}>        
          <View className="top">
            <Image className="avator" src={item.avatarUrl || ''} />
            <Text className="user_name">{item.nickName || ''}</Text>
          </View>
          <Text className="content">{item.content}</Text>
          <View className="bottom">
            <View className="create_time">{item.createTime ? moment(item.createTime).format('YYYY-MM-DD HH:mm:ss') : ''}</View>

            <View className="b_right">
              <View className="c_wrap">
                <MyIcon name="heart" size={18} color="#666" />
                <Text className="number">{item.like || 0}</Text>
              </View>
              {/* <View className="c_wrap">
                <MyIcon name="dialogue" size={17} color="#666" />
                <Text className="number">{item.comment || 0}</Text>
              </View> */}
            </View>
          </View>
        </View>
      ))}
      {!loading && <View className="space">--- · ---</View>}
      <View className="comment_input_wrap">
        <Input className="comment_input" placeholder="请输入你的观点" cursorSpacing={8} value={commentText} onInput={e => setCommentText(e.detail.value)} />
        <Button className="comment_sure" onClick={commentSure} disabled={commentLoading || commentText.length == 0}>
          {commentLoading ? <MyIcon name="refresh" spin size={18} color="#333" /> : '确定'}
        </Button>
      </View>
    </PaginationProvider>
  )
}

Comment.config = {
  navigationBarTitleText: '所有评论',
  enablePullDownRefresh: true
} as Config
