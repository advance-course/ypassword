import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';

export default function Profile() {
  useEffect(()=>{
    console.log(this.$scope.getTabBar().$component)
    this.$scope.getTabBar().$component.setState({
      selected: 1
    })
  }, [])
  return (
    <View>
      <Text>类别</Text>
    </View>
  )
}

Profile.config = {
  "navigationBarTitleText": "类别"
}
