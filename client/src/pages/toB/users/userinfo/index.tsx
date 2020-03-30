import Taro, { Config } from '@tarojs/taro'
import {View} from '@tarojs/components'
import { useSelector } from '@tarojs/redux'
import { ToBUserinfo } from 'pages/toB/users/model'

function UserinfoEditor() {
  const userinfo = useSelector<any, ToBUserinfo>(state => state.toBUserinfo)
  console.log(userinfo.currentUser);
  return (
    <View>用户信息</View>
  )
}

UserinfoEditor.config = {
  navigationBarTitleText: '用户信息'
} as Config

export default UserinfoEditor;