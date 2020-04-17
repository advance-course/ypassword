import Taro, { Config } from '@tarojs/taro';
import { View } from '@tarojs/components'
import { useDispatch, useSelector } from '@tarojs/redux';
import { SetBooleanStatus } from 'store/global';

import GestureLock from '../../../components/GestureLock'

export default function AuthLock(props) {
  const dispatch = useDispatch();

  const lockPwd = Taro.getStorageSync('gesturePwd');

  function closeLock() {
    dispatch({type: 'global/setIsValidate', valid: true})
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
