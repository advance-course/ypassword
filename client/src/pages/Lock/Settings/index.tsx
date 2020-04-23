import Taro, { useEffect, useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtForm, AtSwitch } from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';
import { GlobalState } from 'store/global';

export default function Profile() {
  const { password, isLock, isFingerprintLock, isNinecaseLock } = useSelector<any, GlobalState>(state => state.global)
  const dispatch = useDispatch()
  const [isSupportFinger, setIsSupportFinger] = useState(false)

  useEffect(() => {
    // 验证是否支持指纹识别
    Taro.checkIsSupportSoterAuthentication({
      success: (res) => {
        if (res.supportMode.includes('fingerPrint')) {
          setIsSupportFinger(true)
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  }, [])

  function switchLock(lock: boolean) {
    // 启用密码锁
    if (lock) {
      return dispatch({type: 'global/isLock', payload: true})
    }

    // 禁用密码锁
    if (isFingerprintLock) {
      return Taro.startSoterAuthentication({
        requestAuthModes: ['fingerPrint'],
        challenge: password || '123456',
        authContent: '请使用指纹解锁',
        success: () => {
          dispatch({type: 'global/isLock', payload: false})
        },
        fail: () => {
          Taro.showToast({
            title: '指纹验证错误',
            icon: 'none'
          })
        }
      })
    }

    if (isNinecaseLock) {
      return Taro.navigateTo({
        url: '/pages/Lock/AuthLock/index?status=isLock&value=false',
      })
    }

    // 都关闭的时候，关闭总开
    dispatch({type: 'global/isLock', payload: false});
  }
  
  function switchFingerprintLock(lock: boolean) {
    Taro.startSoterAuthentication({
      requestAuthModes: ['fingerPrint'],
      challenge: password || '123456',
      authContent: '请使用指纹解锁',
      success: () => {
        dispatch({ type: 'global/isFingerprintLock', payload: lock })
      },
      fail: () => {
        Taro.showToast({
          title: '指纹验证错误',
          icon: 'none'
        })
      }
    })
  }

  function switchNinecaseLock(lock: boolean) {
    // 尝试关闭，需要验证密码
    if (!lock) {
      return Taro.navigateTo({
        url: '/pages/Lock/AuthLock/index?status=isNinecaseLock&value=false',
      })
    }

    // 尝试开启，判断是否已经存在密码
    if (password) {
      return dispatch({ type: 'global/isNinecaseLock', payload: true });
    }

    if (!password) {
      Taro.navigateTo({
        url: '/pages/Lock/AuthLock/index?status=isNinecaseLock&value=true'
      })
    }
  }

  return (
    <View>
      <AtForm>
        <AtSwitch title='加密' checked={isLock} onChange={switchLock} />
        {isSupportFinger && <AtSwitch title='指纹锁' disabled={!isLock && isFingerprintLock} checked={isFingerprintLock} onChange={switchFingerprintLock} />}
        <AtSwitch title='九宫格锁' disabled={!isLock && isNinecaseLock} checked={isNinecaseLock} onChange={switchNinecaseLock} />
      </AtForm>
    </View>
  )
}

Profile.config = {
  "navigationBarTitleText": "密码锁"
}