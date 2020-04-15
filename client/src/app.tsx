import Taro, { Component, Config } from '@tarojs/taro';
import {Provider} from '@tarojs/redux';
import models from 'store/index';
import {createApp} from 'utils/dva'
import {View} from '@tarojs/components';
import 'taro-ui/dist/style/index.scss';
import 'assets/css/stylesheet.scss'
import './app.scss';

const dvaApp = createApp({initialState: {}, models});
const store = dvaApp.getStore();

class App extends Component {
  config: Config = {
    pages: [
      "pages/index/index",
      "pages/Profile/subpages/RSAKey/index",
      "pages/Profile/subpages/PrivateKey/index",
      "pages/Profile/subpages/Subscribtion/index",
      "pages/Auth/index",
      "pages/UserInfo/index",
      "pages/Accounts/subpages/Detail/index",
      "pages/Accounts/subpages/Editor/index",
      "pages/Lock/Settings/index",
      "pages/checkin/index",
      "pages/webview/index",
      
      "pages/Home/bookinfo/index",
      "pages/Feeds/articleList/index",
      
      // 分类
      "pages/Category/index",
      "pages/Category/List/index",
      "pages/Category/Edit/index",

      // B端页面
      "pages/toB/users/index",
      "pages/toB/users/userinfo/index",
      "pages/toB/roles/index",
      "pages/toB/resources/index",
      "pages/toB/banner/index",
      "pages/toB/articles/index",
      "pages/toB/articles/subpages/Editor/index",
      "pages/toB/books/index",
      "pages/toB/books/subpages/Editor/index",
      "pages/toB/categoryIcon/index",

      // 额外功能，主功能之外的扩展
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
      backgroundTextStyle: "dark",
      navigationBarBackgroundColor: "#FFF",
      backgroundColor: "#ededed",
      navigationBarTitleText: "码易",
      navigationBarTextStyle: "black"
    },
    cloud: true,
    usingComponents: {}
  };

  componentWillMount() {
    const updateManager = Taro.getUpdateManager()
    updateManager.onUpdateReady(() => {
      updateManager.applyUpdate()
    })
  }

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
