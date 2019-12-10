import Taro, { Config, useEffect } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import {accounts} from './entity';
import "./index.scss";

export default function Index() {
  useEffect(() => {
    Taro.getSetting().then(res => {
      console.log(res);
      if (!res.authSetting || !res.authSetting['scope.userInfo']) {
        Taro.navigateTo({url: '../Auth/index'});
      }
    })
  }, []);

  return (
    <View className="container">
      {accounts.map((item, i) => (
        <View key={i} className="account_item">
          <View className="who_icon">{item.title}</View>
          <View className="info">
            <View className="title">{item.title}</View>
            <View className="username">{item.username}</View>
          </View>
          <AtIcon value="clock" size="20" color="orange" />
        </View>
      ))}
    </View>
  );
}

Index.config = {
  navigationBarTitleText: '常用',
} as Config;