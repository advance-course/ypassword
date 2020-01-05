import Taro, { Config, useEffect, useState } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
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
          <AtIcon value="clock" size="20" color="orange" />
          <AtIcon prefixClass='icon' value='jian' size='40' color='#F00'></AtIcon>
          <AtIcon prefixClass='icon' value='RectangleCopy' size='20' color='#F00'></AtIcon>
        </View>
      ))}
    </View>
  );
}

Index.config = {
  navigationBarTitleText: '常用',
} as Config;
