import Taro from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import { useDispatch } from '@tarojs/redux'
import './index.scss'

export interface ArticleCard {
  info: article.Item,
  editor?: boolean
}

export default function ArticleCard({info, editor}) {
  const dispatch = useDispatch()
  function editorHandler(article: article.Item) {
    if (editor) {
      dispatch({
        type: 'article/info',
        payload: article
      })
      Taro.navigateTo({ url: '/pages/toB/articles/subpages/Editor/index' })
    }
  }

  return (
    <View className="card_wrap">
      <View className="top_warp" onClick={() => editorHandler(info)}>
        <View className="top_left">
          <Image className="gzhaoImg" src={info.subscription!.logo!} mode="aspectFit" />
          <Text className="gzhaoName">{info.subscription!.name}</Text>
        </View>
        <View className="top_right time">{info.time}</View>
      </View>
      <View className="content_wrap" onClick={() => Taro.navigateTo({ url: `/pages/webview/index?url=${info.url}` })}>
        <View className="content_left">
          <View className="title">{info.title}</View>
          <View className="xinfo">
            <Text className="author">{info.subscription!.author}</Text>
            {info.original && <Text className="tag">原创</Text>}
          </View>
        </View>
        {info.thumb && (
          <View className="content_right">
            <Image className="thumb" src={info.thumb!} mode="aspectFill" />
          </View>
        )}
      </View>
    </View>
  )
}