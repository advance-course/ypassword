import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';
import { AtButton } from 'taro-ui';

export default function Profile() {
  const [userInfo, setUserInfo] = useState(0);

  useEffect(() => {
  }, []);

  function getUserInfo(res) {
    console.log(res);
  }

  return (
    <View>
      <AtButton type="primary" openType="getUserInfo" onGetUserInfo={getUserInfo}>一键授权</AtButton>
    </View>
  )
}

Profile.config = {
  "navigationBarTitleText": "设置"
}