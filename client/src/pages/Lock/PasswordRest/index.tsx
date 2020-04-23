import Taro, { Config } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { useSelector } from '@tarojs/redux';
import { GlobalState } from 'store/global';
import './index.scss'

export default function PasswordRest() {
  const {password} = useSelector<any, GlobalState>(state => state.global)

  return (
    <View className="container">
      您的密码为：<Text className="password">{password}</Text>，请妥善保管
    </View>
  )
}

PasswordRest.config = {
  navigationBarTitleText: '找回密码',
} as Config;