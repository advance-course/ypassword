import Taro, { useState, useMemo, useEffect } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

interface TabItem {
  text: string;
  pagePath: string;
  iconPath: string;
  selectedIconPath: string;
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
  backgroundColor ='#fff',
  color='#999',
  tintColor = '#6190e8',
  // fixed = false,
  onClick = () => {},
  tabList = []
}: RealTabBarProps) {
  const [animated, setAnimated] = useState(false)

  const tabItemClick = (index: number) => {
    onClick(index)
    current !== index && setAnimated(true)
  }

  console.log(current)
  return <View className='tab-bar' style={{ backgroundColor }}>
      <View className='tab-bar-wrap'>
        {
          tabList.map((item, index) => <View
            key={index}
            className='tab-bar-wrap-item'
            onClick={tabItemClick.bind(this, index)}
          >
            <View className="tab-bar-wrap-item-iconGroup">
              <Image className={classNames({
                "tab-bar-wrap-item-iconGroup-icon": true,
                indexAnimated: animated && (current === index)
              })} src={item.iconPath}/>
              <View className={classNames({
                'tab-bar-wrap-item-iconGroup-square': true,
                indexAnimated: animated && (current === index)
              })}></View>
              {!!item.badge && <Text className="tab-bar-badge">{item.badge}</Text>}
              {!!item.dot && <Text className="tab-bar-dot"></Text>}
            </View>
            <Text className="tab-bar-wrap-item-text" style={{ color: current == index ? tintColor : color }}>{item.text}</Text>
          </View>)
        }
      </View>
    </View>
}
