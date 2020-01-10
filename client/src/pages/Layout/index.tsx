import Taro, { useState, useEffect } from "@tarojs/taro";
import RealTabBar from "components/tabBar";
import { useSelector } from "@tarojs/redux";
import { View } from "@tarojs/components";
import Index from "pages/index";
import List from "pages/List";
import Profile from "pages/Profile";
import Category from "pages/Category";
import "./index.scss";
import { GlobalState } from "store/global";

export default function Layout() {
  const [current, setCurrent] = useState(0);
  const [initial, setInitial] = useState(true);
  const { isLock, isNinecaseLock, isLocking } = useSelector<any, GlobalState>(state => state.global);

  useEffect(() => {
    // 如果加锁功能是启动状态，并且是九宫格解锁方式，则跳转到九宫格解锁页面
    if (isLock && isLocking && isNinecaseLock) {
      console.log("page navigate to /pages/DrawUnlock/index");
      Taro.navigateTo({
        url: "/pages/DrawUnlock/index"
      });
    }
  }, [isLock, isLocking, isNinecaseLock]);

  return (
    <View>
      {current === 0 && <Index />}
      {current === 1 && <List />}
      {current === 2 && <Category />}
      {current === 3 && <Profile />}
      <RealTabBar
        initial={initial}
        current={current}
        backgroundColor="#edeaed"
        color="#999"
        tintColor="#000"
        fixed
        onClick={(current: number) => {
          setCurrent(current);
          setInitial(false)
        }}
        tabList={[
          {
            text: "首页",
            pagePath: "/pages/index/index",
            iconPath: "home"
          },
          {
            text: "列表",
            pagePath: "/pages/List/index",
            iconPath: "RectangleCopy62"
          },
          {
            text: "分类",
            pagePath: "/pages/Category/index",
            iconPath: "RectangleCopy162",
            badge: 5
          },
          {
            text: "我的",
            pagePath: "/pages/Profile/index",
            iconPath: "RectangleCopy49",
            dot: true
          }
        ]}
      />
    </View>
  );
}
