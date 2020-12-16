import Taro, { Config, useEffect, showShareMenu, usePageScroll } from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import { useSelector } from '@tarojs/redux'
import { BookState } from '../model'
import ArticleCard from 'components/ArticleCard'
import './index.scss'

export default function Bookinfo() {
  const {bookInfo} = useSelector<any, BookState>(state => state.book)
  const {articles = [], subscription = {}} = bookInfo

  showShareMenu({
    withShareTicket: true
  })

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: ''
    })
  }, [bookInfo])

  usePageScroll((res) => {
    console.log(res.scrollTop)
    if (res.scrollTop > 80) {
      Taro.setNavigationBarTitle({ title: bookInfo.name || '' })
    }
    if (res.scrollTop <= 80) {
      Taro.setNavigationBarTitle({ title: '' })
    }
  })

  console.log(bookInfo)

  return (
    <View className="container">
      <View className="title">{bookInfo.name || ''}</View>
      <View className="introduction">
        <View className="info">
          <Image className="logo" src={subscription.logo || ''} />
          <Text className="name">{subscription.name || ''}</Text>
        </View>
        <View className="content">
          <Text>{articles.length || 0} 个内容</Text> · 
          <Text>{bookInfo.introduction || ''}</Text>
        </View>
      </View>
      {articles.map(item => (
        <ArticleCard key={item._id} info={item} editor={false} />
      ))}
      <View className="end">--- · ---</View>
    </View>
  )
}

Bookinfo.config = {
  navigationBarTitleText: '书籍详情',
  navigationBarBackgroundColor: '#fff'
} as Config
