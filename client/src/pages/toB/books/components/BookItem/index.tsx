import Taro from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import MyIcon from 'components/myIcon';
import { useDispatch } from '@tarojs/redux';
import './index.scss'

export interface BookItemProps {
  info: book.Item,
  preview?: boolean,
  onLoad?: () => any,
  onError?: () => any
}

export default function BookItem({info, preview, onLoad, onError}: BookItemProps) {
  const dispatch = useDispatch()
  function clickHandler(book: book.Item) {
    if (preview) {
      return;
    }
    dispatch({
      type: 'book/info',
      payload: book
    })
    Taro.navigateTo({
      url: '/pages/toB/books/subpages/Editor/index'
    })
  }
  function _onLoad() {
    onLoad && onLoad()
  }
  function _onError() {
    onError && onError()
  }
  return (
    <View className="book_item" onClick={() => clickHandler(info)}>
      <View className="left">
        <Image src={info.cover!} className="cover" mode="aspectFill" onLoad={_onLoad} onError={_onError} />
      </View>
      <View className="content">
        <View className="name">{info.name}</View>
        <View className="author_wrap">
          <View className="author">{info.subscription!.author}</View>
          <View className="recommend_warp">
            <MyIcon name="heart" size={18} color="#999999" />
            <Text className="recommend">{info.recommend || 0}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
