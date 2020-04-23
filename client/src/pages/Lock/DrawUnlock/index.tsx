import Taro, { Config } from '@tarojs/taro';
import { View } from '@tarojs/components'
import { useDispatch, useSelector } from '@tarojs/redux';

import GestureLock from '../../../components/GestureLock'
import { GlobalState } from 'store/global';

export default function DrawUnlock() {
  const dispatch = useDispatch();
  const { password } = useSelector<any, GlobalState>(state => state.global)

  function closeLock() {
    dispatch({type: 'global/isLocking', payload: false})
  }

  function setLockPwd(value: string) {
    dispatch({
      type: 'global/updatePassword',
      payload: {
        password: value,
        isNinecaseLock: true
      }
    })
  }

  function forgetPwd() {
    Taro.redirectTo({
      url: '/pages/Lock/PasswordRest/index'
    })
  }
  
  return (
    <View>
      <GestureLock
        lockPwd={password}
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
