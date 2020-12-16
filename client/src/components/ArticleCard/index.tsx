import Taro from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import { useDispatch } from '@tarojs/redux'
import './index.scss'

export interface ArticleCard {
  info: article.Item,
  editor?: boolean,
  onLoad?: () => any,
  onError?: () => any
}

export default function ArticleCard({info, editor, onLoad, onError}: ArticleCard) {
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

  function _onLoad() {
    onLoad && onLoad()
  }

  function _onError() {
    onError && onError()
  }

  return (
    <View className="card_wrap">
      <View className="content_wrap" onClick={() => Taro.navigateTo({ url: `/pages/webview/index?url=${info.url}` })}>
        <View className="content_left">
          <View className="title">{info.title}</View>
          <View className="xinfo">
            <Text>{`${info.subscription!.author} · ${info.original ? '原创 · ' : ''}${info.time}`}</Text>
          </View>
        </View>
        {info.thumb && (
          <View className="content_right">
            <Image className="thumb" src={info.thumb!} mode="aspectFill" onError={_onError} onLoad={_onLoad} />
          </View>
        )}
      </View>
    </View>
  )
}