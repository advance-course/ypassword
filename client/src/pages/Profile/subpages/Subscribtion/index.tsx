import Taro, { Config } from '@tarojs/taro'
import {View} from '@tarojs/components'

export default function Subscribtion() {
  return (
    <View>
      专属订阅号
    </View>
  )
}

Subscribtion.config = {
  navigationBarTitleText: '专属订阅号'
} as Config