import Taro, { Config, useEffect } from '@tarojs/taro';
import { View } from '@tarojs/components';
import qs from 'qs';
import "./index.scss";
import { useSelector, useDispatch } from '@tarojs/redux';
import { AccountState } from 'pages/index/model';

export default function Index() {
  const accounts = useSelector<any, AccountState>(state => state.account);
  // const dispatch = useDispatch();
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
      {accounts.accounts.map((item, i) => (
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
    </View>
  );
}

Index.config = {
  navigationBarTitleText: '常用',
} as Config;
