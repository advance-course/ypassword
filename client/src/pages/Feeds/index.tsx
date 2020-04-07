import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import {gzhaoList} from './entity'
import './index.scss'

export default function Feeds() {
  return (
    <View className="container">
      {gzhaoList.map(item => (
        <View className="gzh_card" key={item.gzhaoId} onClick={() => Taro.navigateTo({url: `/pages/toB/articles/index?gzhaoId=${item.gzhaoId}`})}>
          <View className="left">
            <Image className="logo" src={item.gzhaoLogo} />
          </View>

          <View className="right">
            <View className="name">{item.gzhaoName}</View>
            <View className="desc">{item.gzhaoDesc}</View>
          </View>
        </View>
      ))}
    </View>
  )
}