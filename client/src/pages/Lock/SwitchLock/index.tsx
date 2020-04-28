import Taro, { useEffect } from "@tarojs/taro";
import { useSelector, useDispatch } from "@tarojs/redux";
import { View, Image } from '@tarojs/components';
import Accounts from "pages/Accounts/index";
import { GlobalState } from "store/global";
import DrawUnlock from "pages/Lock/DrawUnlock";
import fingerprint from 'assets/images/fingerprint.svg'
import './index.scss'

export default function SwitchPage () {
  const { isLock, isFingerprintLock, isNinecaseLock, isLocking, password, userInfo } = useSelector<any, GlobalState>(state => state.global);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo.publicKey || !userInfo.privateKey) {
      Taro.navigateTo({url: '/pages/Profile/subpages/RSAKey/index'})
    }
    if (isLocking && isFingerprintLock) {
      AuthLock()
    }
  }, [])

  function AuthLock() {
    Taro.startSoterAuthentication({
      requestAuthModes: ['fingerPrint'],
      challenge: password || '123456',
      authContent: '请使用指纹解锁',
      success: () => {
        dispatch({ type: 'global/isLocking', payload: false })
      },
      fail: () => {
        Taro.showToast({
          title: '指纹验证错误',
          icon: 'none'
        })
      }
    })
  }


  if ((!isLock || !isLocking) || (!isNinecaseLock && !isFingerprintLock)) {
    return <View><Accounts /></View>
  }

  if (isLocking && isNinecaseLock) {
    return <View><DrawUnlock /></View>
  }

  return <View className="auth_lock_wrap">
    {
      <View className="btn_auth_wrap" onClick={AuthLock}>
        <Image className="img_fingerprint" src={fingerprint}></Image>
        <View className="tips_text">点击进行指纹解锁</View>
      </View>
    }
  </View>
}