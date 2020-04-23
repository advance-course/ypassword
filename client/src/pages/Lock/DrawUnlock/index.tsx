import Taro, { Config } from '@tarojs/taro';
import { View } from '@tarojs/components'
import { useDispatch } from '@tarojs/redux';

import GestureLock from '../../../components/GestureLock'

export default function DrawUnlock() {
  const dispatch = useDispatch();

  const lockPwd = Taro.getStorageSync('gesturePwd');

  function closeLock() {
    dispatch({type: 'global/isLocking', payload: false})
  }

  function setLockPwd(pwd) {
    Taro.setStorageSync('gesturePwd', pwd);

    dispatch({ type: 'global/isNinecaseLock', payload:true});
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
        setLockPwd={setLockPwd}
        forgetPwd={forgetPwd}
      />
    </View>
  )
}

DrawUnlock.config = {
  disableScroll: true,
  navigationBarTitleText: '手势解锁',
} as Config
