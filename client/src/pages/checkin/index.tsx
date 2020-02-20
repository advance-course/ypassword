import Taro, { Config } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";

export default function CheckIn() {
  return (
    <View>每日签到</View>
  );
}

CheckIn.config = {
  navigationBarTitleText: "每日签到",
  navigationBarBackgroundColor: "#ffe100",
  navigationBarTextStyle: "black"
} as Config;
