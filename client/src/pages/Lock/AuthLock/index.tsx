import Taro, { Config } from '@tarojs/taro';
import { View } from '@tarojs/components'
import { useDispatch } from '@tarojs/redux';

import GestureLock from '../../../components/GestureLock'

export default function AuthLock(props) {
  const dispatch = useDispatch();

  const lockPwd = Taro.getStorageSync('gesturePwd');

  console.log(props)

  function closeLock() {
    dispatch({type: 'global/setIsLock', isLock: false})
    Taro.navigateBack()
  }

  function forgetPwd() {
    Taro.redirectTo({
      url: '/pages/Lock/PasswordRest/index'
    })
  }
  
  return (
    <View>
      <GestureLock
        lockPwd={lockPwd}
        closeLock={closeLock}
        forgetPwd={forgetPwd}
      />
    </View>
  )
}

AuthLock.config = {
  disableScroll: true,
  navigationBarTitleText: '手势解锁',
} as Config
