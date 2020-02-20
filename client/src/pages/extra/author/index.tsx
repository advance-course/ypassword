import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default function Author() {
  return (
    <View>
      <Text>联系作者</Text>
    </View>
  )
}

Author.config = {
  "navigationBarTitleText": "联系作者"
}
