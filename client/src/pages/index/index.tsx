import Taro, { Config, useEffect } from '@tarojs/taro';
import { View } from '@tarojs/components';
import qs from 'qs';
import {accounts} from './entity';
import "./index.scss";
import MyIcon from 'components/myIcon';

export default function Index() {
  useEffect(() => {
    Taro.getSetting().then(res => {
      console.log(res);
      if (!res.authSetting || !res.authSetting['scope.userInfo']) {
        Taro.navigateTo({url: '../Auth/index'});
      }
    })
  }, []);

  const a = qs.stringify({a: 1, b: 2});
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
      <View>
        设置字体大小
        <MyIcon type='RectangleCopy5' size={60}></MyIcon>
      </View>
      <View>
        设置颜色
        <MyIcon type='jian' color={'#f0f'}></MyIcon>
      </View>
      <MyIcon type='RectangleCopy'></MyIcon>
      <MyIcon type='RectangleCopy1'></MyIcon>
      <MyIcon type='RectangleCopy2'></MyIcon>
      <MyIcon type='RectangleCopy3'></MyIcon>
      <View>
        测试字体
        <View>这是原字体</View>
        <View className='din'>this is DIN English font</View>
      </View>
    </View>
  );
}

Index.config = {
  navigationBarTitleText: '常用',
} as Config;
