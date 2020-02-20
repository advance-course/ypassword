import Taro, {Config} from "@tarojs/taro";
import {View} from "@tarojs/components";
import "./index.scss";

export default function Users() {  
  return (
    <View>
      用户管理
    </View>
  );
}

Users.config = {
  navigationBarTitleText: "用户管理",
  navigationBarBackgroundColor: "#ffe100",
  navigationBarTextStyle: "black"
} as Config;
