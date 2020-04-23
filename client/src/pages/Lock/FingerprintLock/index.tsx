import Taro, { Config, useRef, useEffect } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { useSelector, useDispatch } from '@tarojs/redux';

import { SetBooleanStatus } from 'store/global'
import fingerprint from 'assets/images/fingerprint.svg'
import './index.scss'

export default function AuthLock() {
  const global = useSelector<any, SetBooleanStatus>(state => state.global)
  const dispatch = useDispatch();

  useEffect(():any => {

    AuthLock()

  }, [])

  function AuthLock() {
    Taro.startSoterAuthentication({
      requestAuthModes: ['fingerPrint'],
      challenge: '123456',
      authContent: '请用指纹解锁',
      success(res) {
        dispatch({type: 'global/isLocking', payload: false})
        return Taro.navigateTo({url: '/pages/index/index'})
      }
    })
  }

  return(
    <View className="auth_lock_wrap">
      {
        global.isLock &&
        <View className="btn_auth_wrap" onClick={AuthLock}>
          <Image className="img_fingerprint" src={fingerprint}></Image>
          <View className="tips_text">点击进行指纹解锁</View>
        </View>
      }
    </View>
  )
}

AuthLock.config = {
  navigationBarTitleText: '指纹解锁',
} as Config;