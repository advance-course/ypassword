import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';
import RealTabBar from 'components/tabBar';

export default function Category() {
  return (
    <View>
      <Text>类别</Text>
    </View>
  )
}

Category.config = {
  "navigationBarTitleText": "类别"
}
