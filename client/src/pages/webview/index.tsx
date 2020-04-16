import Taro, { Config, showShareMenu, useShareAppMessage, useRouter, useEffect } from "@tarojs/taro";
import { WebView } from "@tarojs/components";
import { useSelector, useDispatch } from '@tarojs/redux';
import { GlobalState } from 'store/global';

export default function Webview() {
  const {params} = useRouter()
  const dispatch = useDispatch()
  const global = useSelector<any, GlobalState>(state => state.global)

  useEffect(() => {
    dispatch({ type: 'global/login' })
  }, [global.isFirstEnter])

  useShareAppMessage((opt) => {
    return {
      path: `/pages/webview?url=${params.url}`
    }
  })

  showShareMenu({
    withShareTicket: true
  })
  
  return (
    <WebView src={params.url} />
  );
}

Webview.config = {
  navigationBarTitleText: "",
  navigationBarBackgroundColor: "#FFF",
  navigationBarTextStyle: "black"
} as Config;
