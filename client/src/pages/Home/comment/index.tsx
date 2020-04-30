import Taro, { useRouter, Config } from '@tarojs/taro'
import {View, ScrollView, Input} from '@tarojs/components'
import './index.scss'

export default function Comment() {
  const router = useRouter()
  const {key} = router.params

  console.log(key)

  return (
    <View className="comment_container">
      <ScrollView className="scroll">
        helow pinglunxitong

        helow pinglunxitong
        <View className="comment">
          helow
        </View>
        <View className="comment">
          helow
        </View>
        <View className="comment">
          helow
        </View>
      </ScrollView>
    </View>
  )
}

Comment.config = {
  navigationBarTitleText: '评论'
} as Config
