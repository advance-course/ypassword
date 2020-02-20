import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

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
