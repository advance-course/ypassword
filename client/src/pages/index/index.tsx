import Taro, { Config, useEffect } from '@tarojs/taro';
import { View } from '@tarojs/components';
import qs from 'qs';
import { accounts } from './entity';
import "./index.scss";

export default function Index() {

  useEffect(() => {
    Taro.getSetting().then(res => {
      console.log(res);
      if (!res.authSetting || !res.authSetting['scope.userInfo']) {
        Taro.navigateTo({ url: '../Auth/index' });
      }
    })
    // Taro.hideTabBar()
  }, []);

  const a = qs.stringify({ a: 1, b: 2 });
  console.log(a);

  return (
    <View className="container">
      {accounts.map((item, i) => (
        <View
          onClick={() => Taro.navigateTo({ url: `/pages/Account/Detail/index?${qs.stringify(item)}` })}
          key={i}
          className="account_item"
        >
          <View className="who_icon">{item.title}</View>
          <View className="info">
            <View className="title">{item.title}</View>
            <View className="username">{item.username}</View>
          </View>
        </View>
      ))}
      <View  onClick={() => Taro.navigateTo({ url: `/pages/IconIndex/index` })}>
        <View className="account_item">图标</View>
      </View>
    </View>
  );
}

Index.config = {
  navigationBarTitleText: '常用',
} as Config;
