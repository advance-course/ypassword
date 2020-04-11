import Taro, { Config } from '@tarojs/taro';
import { View } from '@tarojs/components'
import { useDispatch } from '@tarojs/redux';

import GestureLock from '../../components/GestureLock'
import './index.scss';

export default function DrawUnlock() {
  const dispatch = useDispatch();

  const lockPwd = Taro.getStorageSync('gesturePwd');

  function closeLock() {
    dispatch({type: 'global/setIsLocking', isLocking: false})
  }

  function setLockPwd(pwd) {
    Taro.setStorageSync('gesturePwd', pwd);

    dispatch({type: 'global/setIsNinecaseLock', isNinecaseLock:true});
    dispatch({type: 'global/setIsLock', isLock: true})
  }

  function forgetPwd() {
    Taro.redirectTo({
      url: '/pages/PasswordRest/index'
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
