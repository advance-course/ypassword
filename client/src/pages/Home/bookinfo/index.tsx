import Taro, { Config, useEffect, showShareMenu } from '@tarojs/taro'
import {View} from '@tarojs/components'
import { useSelector } from '@tarojs/redux'
import { BookState } from '../model'
import ArticleCard from 'components/ArticleCard'
import './index.scss'

export default function Bookinfo() {
  const {bookInfo} = useSelector<any, BookState>(state => state.book)
  const {articles = []} = bookInfo

  showShareMenu({
    withShareTicket: true
  })
  
  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: bookInfo.name || '书籍详情'
    })
  }, [bookInfo])

  return (
    <View className="container">
      {articles.map(item => (
        <ArticleCard key={item._id} info={item} editor={false} />
      ))}
    </View>
  )
}

Bookinfo.config = {
  navigationBarTitleText: '书籍详情',
  navigationBarBackgroundColor: '#ededed'
} as Config