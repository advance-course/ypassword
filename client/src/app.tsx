import "@tarojs/async-await";
import Taro, { Component, Config } from '@tarojs/taro';
import {Provider} from '@tarojs/redux';
import models from 'store/index';
import {createApp} from 'utils/dva'
import {View} from '@tarojs/components';

import 'taro-ui/dist/style/index.scss';
import './assets/css/iconfont.css'
import './assets/css/stylesheet.css'
import './app.scss';

const dvaApp = createApp({initialState: {}, models});
const store = dvaApp.getStore();

class App extends Component {
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/Category/index',
      'pages/Profile/index',
      'pages/Auth/index',
      'pages/UserInfo/index',
      'pages/Account/Detail/index',
      'pages/Account/Editor/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#FAE14C',
      backgroundColor: '#FFF',
      navigationBarTitleText: 'WeChart',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#CCC',
      selectedColor: '#458CFA',
      backgroundColor: '#F7F7F7',
      borderStyle: 'white',
      position: 'bottom',
      list: [
        {
          text: '',
          pagePath: 'pages/index/index',
          iconPath: 'assets/navigations/home_default@2x.png',
          selectedIconPath: 'assets/navigations/home_active@2x.png'
        },
        {
          text: '',
          pagePath: 'pages/Category/index',
          iconPath: 'assets/navigations/message_default@2x.png',
          selectedIconPath: 'assets/navigations/message_active@2x.png'
        },
        {
          text: '',
          pagePath: 'pages/Profile/index',
          iconPath: 'assets/navigations/profile_default@2x.png',
          selectedIconPath: 'assets/navigations/profile_active@2x.png'
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
