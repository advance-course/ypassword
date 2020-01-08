import Taro from '@tarojs/taro';
import { View, Label, Image } from '@tarojs/components';
import { AtForm, AtSwitch } from 'taro-ui';
import './index.scss';

export default function Profile() {
  function anyFn() {}
  return (
    <View>
      <AtForm>
        <AtSwitch title='是否启用密码锁' onChange={anyFn} />
        <AtSwitch title='指纹锁' onChange={anyFn} />
        <AtSwitch title='九宫格锁' onChange={anyFn} />
      </AtForm>
    </View>
  )
}

Profile.config = {
  "navigationBarTitleText": "密码锁"
}