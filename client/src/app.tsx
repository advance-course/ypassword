import Taro, { Component, Config } from '@tarojs/taro';
import {Provider} from '@tarojs/redux';
import models from 'store/index';
import {createApp} from 'utils/dva'
import {View} from '@tarojs/components';
import 'taro-ui/dist/style/index.scss';
import './app.scss';
import 'assets/css/stylesheet.scss'

const dvaApp = createApp({initialState: {}, models});
const store = dvaApp.getStore();

class App extends Component {
  config: Config = {
    pages: [
      "pages/index/index",
      "pages/PasswordRest/index",
      "pages/FingerprintLock/index",
      "pages/DrawUnlock/index",
      "pages/Profile/subpages/RSAKey/index",
      "pages/Auth/index",
      "pages/UserInfo/index",
      "pages/Account/Detail/index",
      "pages/Account/Editor/index",
      "pages/Settings/Lock/index",
      "pages/checkin/index",

      // B端页面
      "pages/toB/users/index",
      "pages/toB/roles/index",
      "pages/toB/resources/index",
      "pages/toB/banner/index",
      "pages/toB/articles/index",
      "pages/toB/categoryIcon/index",

      // 额外功能，主功能之外的扩展
      "pages/extra/articles/index",
      "pages/extra/author/index",
      "pages/extra/devteam/index",

      // examples
      "pages/examples/icon/index",
      
      // 不可变数据集案例
      "pages/Immutable/index",
      "pages/Immutable/examples/demo-01/index",
      "pages/Immutable/examples/demo-02/index",
      "pages/Immutable/examples/demo-03/index",
      "pages/Immutable/examples/demo-04/index",
      "pages/Immutable/examples/demo-before-lib",
      "pages/Immutable/examples/demo-immer",
      "pages/Immutable/examples/demo-immutable",

      "pages/Taroui/index"
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#FAE14C",
      backgroundColor: "#FFF",
      navigationBarTitleText: "WeChart",
      navigationBarTextStyle: "black"
    },
    cloud: true,
    usingComponents: {}
  };

  componentDidMount() {
    if (process.env.TARO_ENV === "weapp") {
      Taro.cloud.init({
        traceUser: true,
        env: "release-d541f1"
      });
    }
  }
  render() {
    return (
      <Provider store={store}>
        <View />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById('app'))
