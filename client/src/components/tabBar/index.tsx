import Taro, { useState, useMemo, useEffect } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import MyIcon from 'components/myIcon'
import classNames from 'classnames'
import './index.scss'
// import arc from 'assets/tabbar/arc.png' // 这里暂时用图片代替

interface TabItem {
  text: string;
  pagePath: string;
  iconPath: string;
  badge?: number;
  dot?: boolean;
}

interface RealTabBarProps {
  current: number;
  backgroundColor: string;
  color: string;
  tintColor: string;
  fixed: boolean;
  onClick: (index: number) => any;
  tabList: TabItem[]
}

export default function RealTabBar({
  current = 0,
  backgroundColor = '#fff',
  color = '#999',
  tintColor = '#6190e8',
  // fixed = false,
  onClick = () => { },
  tabList = []
}: RealTabBarProps) {
  const [animated, setAnimated] = useState(false)

  const tabItemClick = (index: number) => {
    onClick(index)
    current !== index && setAnimated(true)
  }

  console.log(animated && (current === 1) && 'animated')
  return <View className='tab-bar' style={{ backgroundColor }}>
    <View className='tab-bar-wrap'>
      {
        tabList.map((item, index) => <View
          key={index}
          className='tab-bar-wrap-item'
          onClick={tabItemClick.bind(this, index)}
        >
          <View className={classNames({
            "tab-bar-wrap-item-iconGroup": true,
            animated: animated && (current === index),
            // 为每个tab 的 center 部分 定义一个不同的动画
            animate0: index === 0,
            animate1: index === 1,
            animate2: index === 2,
          })}>
            <View className="tab-bar-wrap-item-iconGroup-icon">
              <MyIcon size={35} type={item.iconPath} />
            </View>
            <View className='tab-bar-wrap-item-iconGroup-square'></View>
            <View className='tab-bar-wrap-item-iconGroup-center'>
            </View>
            {index === 1 && <View className='animate1-help-curve'>
            </View>}
            {index === 2 && <View className='animate2-help'>
              <View className='animate2-help-line'>{/*这里应是集成到 icon 中  */}</View>
              <View className='animate2-help-lineHidden'></View>
            </View>}
            {!!item.badge && <Text className="tab-bar-badge">{item.badge}</Text>}
            {!!item.dot && <Text className="tab-bar-dot"></Text>}
          </View>
          <Text className="tab-bar-wrap-item-text" style={{ color: current == index ? tintColor : color }}>{item.text}</Text>
        </View>)
      }
    </View>
  </View>
}
