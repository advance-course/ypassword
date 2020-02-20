import Taro, {Config} from "@tarojs/taro";
import {View} from "@tarojs/components";
import "./index.scss";

export default function Banner() {  
  return (
    <View>
      首页banner管理
    </View>
  );
}

Banner.config = {
  navigationBarTitleText: "首页banner管理",
  navigationBarBackgroundColor: "#ffe100",
  navigationBarTextStyle: "black"
} as Config;
