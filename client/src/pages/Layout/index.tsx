import Taro, { useState } from '@tarojs/taro'
import './index.scss'
import RealTabBar from 'components/tabBar'
import { View } from '@tarojs/components'
import Index from 'pages/index'
import Category from 'pages/Category'
import Profile from 'pages/Profile'

export default function Layout() {
  const [current, setCurrentTabIndex] = useState(0)

  return (
    <View>
      {current === 0 && <Index />}
      {current === 1 && <Category />}
      {current === 2 && <Profile />}
      <RealTabBar
        current={current}
        backgroundColor='#f8f8f8'
        color='#999'
        tintColor='#6190e8'
        fixed
        onClick={(index: number) => setCurrentTabIndex(index)}
        tabList={[
          {
            text: '',
            pagePath: '/pages/index/index',
            iconPath: 'RectangleCopy5',
          },
          {
            text: '',
            pagePath: '/pages/Category/index',
            iconPath: 'RectangleCopy34',
          },
          {
            text: '',
            pagePath: '/pages/Profile/index',
            iconPath: 'RectangleCopy162',
          },
        ]}
      />
    </View>
  )
}
