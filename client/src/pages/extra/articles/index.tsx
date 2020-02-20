import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default function Articles() {
  return (
    <View>
      <Text>公众号文章阅读</Text>
    </View>
  )
}

Articles.config = {
  "navigationBarTitleText": "公众号文章阅读"
}
