import Taro, {Config} from "@tarojs/taro";
import {View} from "@tarojs/components";
import "./index.scss";

export default function Articles() {  
  return (
    <View>
      公众号文章配置管理
    </View>
  );
}

Articles.config = {
  navigationBarTitleText: "公众号文章配置",
  navigationBarBackgroundColor: "#ffe100",
  navigationBarTextStyle: "black"
} as Config;
