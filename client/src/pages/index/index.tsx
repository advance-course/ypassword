import Taro, { useState, useEffect, Config, useRef } from "@tarojs/taro";
import RealTabBar from "components/tabBar";
import { useSelector, useDispatch } from "@tarojs/redux";
import { View } from "@tarojs/components";

import Home from "pages/Home";
import List from "pages/List";
import Profile from "pages/Profile";
import Category from "pages/Category";

import { GlobalState, SetBooleanStatus } from "store/global";
import {loginApi} from './api';
import "./index.scss";

export const titles = {
  0: '首页',
  1: '列表',
  2: '分类',
  3: '我的'
}

export default function Layout() {
  const { isFirstUse, isFirstEnter, isLock, isNinecaseLock, isFingerprintLock, isLocking } = useSelector<any, GlobalState>(state => state.global);
  const [current, setCurrent] = useState(0);
  const [initial, setInitial] = useState(true);
  const userInfoRef = useRef<any>(null);

  const global = useSelector<any, SetBooleanStatus>(state => state.global);
  const dispatch = useDispatch();

  useEffect(() => {
    Taro.getSetting().then(res => {
      if (!res.authSetting || !res.authSetting["scope.userInfo"]) {
        return Taro.navigateTo({ url: "../Auth/index" });
      }
    });

    login();
  }, []);

  useEffect(() => {
    // 首次使用
    if (isFirstUse) {
      Taro.checkIsSupportSoterAuthentication({
        success(res) {
          if (res.supportMode.indexOf('fingerPrint') > -1 && !global.isNinecaseLock) {
            dispatch({type: 'global/setIsLock', isLock: true})
            dispatch({type: 'global/setIsFingerprintLock', isFingerprintLock: true})
          }
        }
      })

      dispatch({type: 'global/setIsFirstUse', isFirstUse: false})
    }
  }, [])

  useEffect(():any => {
    // 如果加锁功能是启动状态，并且是九宫格解锁方式，则跳转到九宫格解锁页面
    if (isLock && isLocking) {
      isFingerprintLock && Taro.redirectTo({url: '/pages/FingerprintLock/index'})
  
      isNinecaseLock && Taro.redirectTo({url: '/pages/DrawUnlock/index'})
    }
  }, []);

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: titles[current] });
  }, [current]);

  // 获取用户信息，进行登陆，返回服务器用户信息
  function login() {
    if (isFirstEnter) {
      loginApi().then(res => {
        userInfoRef.current = res.data
        Taro.setStorageSync('userInfo', res.data)
        dispatch({ type: "setIsFirstEnter", isFirstEnter: false });
        dispatch({ type: 'global/setUserId', userId: res.data._id })  
      }).catch(err => {
        if ([401, 40101, 40102, 40103].includes(err.code)) {
          Taro.navigateTo({url: '/pages/Auth/index'})
        }
      });
    }
  }

  return (
    <View>
      {current === 0 && <Home />}
      {current === 1 && <List />}
      {current === 2 && <Category />}
      {current === 3 && <Profile />}
      <RealTabBar
        onClick={(current: number) => { setCurrent(current); setInitial(false); }}
        initial={initial}
        current={current}
        backgroundColor="#edeaed"
        color="#999"
        tintColor="#000"
        fixed
        tabList={[
          {text: "首页", iconPath: "home"},
          {text: "账户", iconPath: "RectangleCopy62"},
          {text: "分类", iconPath: "RectangleCopy162", badge: 5},
          {text: "我的", iconPath: "RectangleCopy49", dot: true}
        ]}
      />
    </View>
  );
}

Layout.config = {
  navigationBarTitleText: "",
  navigationBarBackgroundColor: "#ffe100",
  navigationBarTextStyle: "black"
} as Config;
