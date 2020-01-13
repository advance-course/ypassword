import Taro, { Config, useRef, useEffect } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { useSelector, useDispatch } from '@tarojs/redux';

import { SetBooleanStatus } from 'store/global'
import './index.scss'

export default function AuthLock() {
  const global = useSelector<any, SetBooleanStatus>(state => state.global)
  const dispatch = useDispatch();

  useEffect(() => {
    Taro.checkIsSupportSoterAuthentication({
      success(res) {
        console.log(res.supportMode.indexOf('fingerPrint'))
        if (res.supportMode.indexOf('fingerPrint') > -1 && !global.isNinecaseLock) {
          dispatch({type: 'global/setIsLock', isLock: true})
          dispatch({type: 'global/setIsFingerprintLock', isFingerprintLock: true})
        }
      }
    })
  }, [])

  useEffect(():any => {

    AuthLock()

  }, [])

  function AuthLock() {
    if (global.isLock && global.isLocking) {
      if (global.isFingerprintLock) {
        Taro.startSoterAuthentication({
          requestAuthModes: ['fingerPrint'],
          challenge: '123456',
          authContent: '请用指纹解锁',
          success(res) {
            dispatch({type: 'global/setIsLocking', isLocking: false})
            return Taro.switchTab({url: '/pages/index/index'})
          }
       })
      }

      if (global.isNinecaseLock) {
        return Taro.redirectTo({url: '/pages/DrawUnlock/index'})
      }

    } else {
      return Taro.switchTab({url: '/pages/index/index'})
    }
  }

  return(
    <View className="auth-lock-wrap">
      {
        global.isLock && <View className="btn-auth-lcok" onClick={AuthLock}>立即验证</View>
      }
    </View>
  )
}

AuthLock.config = {
  navigationBarTitleText: '解锁',
} as Config;