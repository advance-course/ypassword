import Taro, { Config } from '@tarojs/taro'
import {View} from '@tarojs/components'
import { useSelector } from '@tarojs/redux'
import { BookState } from '../model'

export default function Bookinfo() {
  const {bookInfo} = useSelector<any, BookState>(state => state.book)

  console.log(bookInfo)

  return (
    <View>bookinfo</View>
  )
}

Bookinfo.config = {
  navigationBarTitleText: '书籍详情'
} as Config