import Taro, {Config} from "@tarojs/taro";
import {View} from "@tarojs/components";
import "./index.scss";

export default function Roles() {  
  return (
    <View>
      角色管理
    </View>
  );
}

Roles.config = {
  navigationBarTitleText: "角色管理",
  navigationBarBackgroundColor: "#ffe100",
  navigationBarTextStyle: "black"
} as Config;
