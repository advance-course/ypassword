import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/mobx'
import { View } from '@tarojs/components'
import * as store from 'src/store'

import './app.scss'

class App extends Component {
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/Profile/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#CCC',
      selectedColor: '#458CFA',
      backgroundColor: '#fcfcfc',
      borderStyle: 'white',
      position: 'bottom',
      list: [
        {
          text: '密码',
          pagePath: 'pages/index/index',
          iconPath: 'assets/navigations/customer_default.png',
          selectedIconPath: 'assets/navigations/customer_active.png'
        },
        {
          text: '我的',
          pagePath: 'pages/Profile/index',
          iconPath: 'assets/navigations/profile_default.png',
          selectedIconPath: 'assets/navigations/profile_active.png'
        },
      ]
    },
    cloud: true
  }

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({
        traceUser: true,
        env: 'release-d541f1'
      })
    }
  }

  render () {
    return (
      <Provider store={store}>
        <View />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
