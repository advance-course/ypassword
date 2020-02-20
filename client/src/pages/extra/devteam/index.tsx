import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default function Devteam() {
  return (
    <View>
      <Text>开发团队</Text>
    </View>
  )
}

Devteam.config = {
  "navigationBarTitleText": "开发团队"
}
