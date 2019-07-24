import Taro, { Component, Config } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import { AtButton } from 'taro-ui';
import './index.scss'

import { LoginStore } from 'src/store/login';

interface LoginProps {
  LoginStore: LoginStore
}

@inject('LoginStore')
@observer
export default class Index extends Component<LoginProps> {
  config: Config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount() {
    Taro.getSetting().then((res) => {
      console.log(res);
      if (!res.authSetting || !res.authSetting['scope.userInfo']) {
        Taro.navigateTo({ url: '../Auth/index' })
      }
    })
  }

  render () {
    return (
      <View className='index'>
        <AtButton onClick={() => Taro.navigateTo({ url: '../Auth/index' })}>nav to auth</AtButton>
      </View>
    )
  }
}
