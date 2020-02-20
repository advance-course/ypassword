import Taro, {Config} from "@tarojs/taro";
import {View} from "@tarojs/components";
import "./index.scss";

export default function Resources() {  
  return (
    <View>
      资源管理
    </View>
  );
}

Resources.config = {
  navigationBarTitleText: "角色管理",
  navigationBarBackgroundColor: "#ffe100",
  navigationBarTextStyle: "black"
} as Config;
