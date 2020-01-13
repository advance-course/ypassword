import Taro, { useState, useEffect, Config } from "@tarojs/taro";
import RealTabBar from "components/tabBar";
import { useSelector } from "@tarojs/redux";
import { View } from "@tarojs/components";
import Home from "pages/Home";
import List from "pages/List";
import Profile from "pages/Profile";
import Category from "pages/Category";
import { GlobalState } from "store/global";
import "./index.scss";

export const titles = {
  0: '首页',
  1: '列表',
  2: '分类',
  3: '我的'
}

export default function Layout() {
  const { isLock, isNinecaseLock, isLocking } = useSelector<any, GlobalState>(state => state.global);
  const [current, setCurrent] = useState(0);
  const [initial, setInitial] = useState(true);

  useEffect(() => {
    // 如果加锁功能是启动状态，并且是九宫格解锁方式，则跳转到九宫格解锁页面
    if (isLock && isLocking && isNinecaseLock) {
      Taro.navigateTo({ url: "/pages/DrawUnlock/index" });
    }
  }, [isLock, isLocking, isNinecaseLock]);

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: titles[current] });
  }, [current]);

  return (
    <View>
      {current === 0 && <Home />}
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
            iconPath: "home"
          },
          {
            text: "列表",
            iconPath: "RectangleCopy62"
          },
          {
            text: "分类",
            iconPath: "RectangleCopy162",
            badge: 5
          },
          {
            text: "我的",
            iconPath: "RectangleCopy49",
            dot: true
          }
        ]}
      />
    </View>
  );
}

Layout.config = {
  navigationBarTitleText: '',
  navigationBarBackgroundColor: '#ffe100',
  navigationBarTextStyle: 'black',
} as Config;