import Taro, { Config, useEffect } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import { useSelector } from 'utils/dva';
import { LoginState } from 'pages/index/model';
import "./index.scss";

export default function Index() {
  const login = useSelector<any, LoginState>(state => state.login);
  useEffect(() => {
    Taro.getSetting().then(res => {
      console.log(res);
      if (!res.authSetting || !res.authSetting['scope.userInfo']) {
        Taro.navigateTo({url: '../Auth/index'});
      }
    })
  }, []);

  return (
    <View className='index'>
        <AtButton onClick={() => Taro.navigateTo({ url: '../Auth/index' })}>nav to auth2</AtButton>
        <Text>{login.isLogin}</Text>
      </View>
  );
}

Index.config = {
  navigationBarTitleText: '首页'
} as Config;