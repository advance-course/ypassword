import Taro, { Config } from "@tarojs/taro";
import { WebView } from "@tarojs/components";

export default function Webview() {
  const url = this.$router.params.url;
  return (
    <WebView src={url} />
  );
}

Webview.config = {
  navigationBarTitleText: "",
  navigationBarBackgroundColor: "#ffe100",
  navigationBarTextStyle: "black"
} as Config;
