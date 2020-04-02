import Taro, { Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { icons } from './config';
import MyIcon from 'components/myIcon';
import "./index.scss";

export default function IconIndex() {
  return (
    <View className="container">
      <View className="title_wrapper">
        <Text className="title">基础用法</Text>
      </View>
      <View className="base_wrapper">
        <View className="item">设置字体大小：<MyIcon name='safe' size={60} /></View>
        <View className="item">设置颜色：<MyIcon name='reduce' color={'#f0f'} /></View>
        <View className="item">设置旋转：<MyIcon name='reduce' spin /></View>
        <View className="item">更多图标：https://www.iconfont.cn/collections/detail?cid=16880</View>
      </View>

      <View className="title_wrapper">
        <Text className="title">所有图标</Text>  
      </View>
      <View className="icons_wrapper">
        {icons.map((name) => (
          <View key={name} className='itemContainer'>
            <MyIcon name={name} />
            <Text className='itemStyle'>{name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

IconIndex.config = {
  navigationBarTitleText: '图标',
} as Config;
