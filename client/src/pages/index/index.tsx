import Taro, { Config, useRef, useEffect } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import qs from 'qs';
import { SetBooleanStatus } from 'store/global'
import "./index.scss";
import { useSelector, useDispatch } from '@tarojs/redux';
import { AccountState } from 'pages/index/model';

interface UserInfo {
  _id?: string,
  avatarUrl?: string,
  city?: string,
  country?: string,
  gender?: string,
  language?: string,
  nickName?: string,
  province?: string,
}

export default function Index() {
  let userInfoRef = useRef<UserInfo>({})

  const global = useSelector<any, SetBooleanStatus>(state => state.global)
  const accounts = useSelector<any, AccountState>(state => state.account);
  const dispatch = useDispatch();
  
  useEffect(() => {
    Taro.getSetting().then(res => {
      if (!res.authSetting || !res.authSetting['scope.userInfo']) {
        Taro.navigateTo({url: '../Auth/index'});
      }
    })
  }, []);

  useEffect(() => {
    if (global.isFirstEnter) {
      login().then(() => {
        dispatch({type: 'setIsFirstEnter', isFirstEnter: false})
      })
    }

  }, [])

  // 获取用户信息，进行登陆，返回服务器用户信息
  async function login() {
    const res = await Taro.cloud.callFunction({
      name: 'user',
      data: {
        $url: 'login'
      }
    })

    if (res.result) {
      userInfoRef.current = res.result

      Taro.setStorageSync('userInfo', res.result)

      dispatch({type: 'global/setUserId', userId: res.result._id})
    }
  }

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
          <AtIcon value="clock" size="20" color="orange" />
        </View>
      ))}
    </View>
  );
}

Index.config = {
  navigationBarTitleText: '常用',
} as Config;