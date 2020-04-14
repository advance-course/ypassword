import Taro, { Config, showShareMenu } from "@tarojs/taro";
import { WebView } from "@tarojs/components";

export default function Webview() {
  showShareMenu({
    withShareTicket: true
  })
  const url = this.$router.params.url;
  return (
    <WebView src={url} />
  );
}

Webview.config = {
  navigationBarTitleText: "",
  navigationBarBackgroundColor: "#FFF",
  navigationBarTextStyle: "black"
} as Config;
