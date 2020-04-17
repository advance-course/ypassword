import Taro, { useEffect } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtForm, AtSwitch } from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';
import { SetBooleanStatus } from 'store/global';

export default function Profile() {
  const { isValidate, whichValidate, isLock, isFingerprintLock, isNinecaseLock } = useSelector<any, SetBooleanStatus>(state => state.global)
  const dispatch = useDispatch()

  useEffect(() => {
    // 把验证重置为 false
    dispatch({type: 'global/setIsValidate', valid: false})
  }, [])

  useEffect(() => {
    // 是否验证通过
    if (isValidate) {

      // 当前是哪个做的验证，总开关，还是手势
      switch(whichValidate) {
        case 'globalLock':
          dispatch({type: 'global/setIsLock', isLock: false});
          break;
        case 'ninecaseLock':
          dispatch({type: 'global/setIsNinecaseLock', isNinecaseLock:false});
          break;
      }
    }
  }, [isValidate])

  // 验证指纹
  function authFingerprintLock (success, fail = ()=>{}) {
    Taro.startSoterAuthentication({
      requestAuthModes: ['fingerPrint'],
      challenge: '123456',
      authContent: '请用指纹解锁',
      success,
      fail
    })
  }

  function switchLock(lock) {
    if (lock) {
      dispatch({type: 'global/setWhichValidate', name: ''})
      dispatch({type: 'global/setIsLock', isLock: true})
    } else {  // 关闭锁要验证
      if (isFingerprintLock) {
        authFingerprintLock(() => {
            dispatch({type: 'global/setIsFingerprintLock', isFingerprintLock: lock})
        })
      }

      if (isNinecaseLock) {
        dispatch({type: 'global/setWhichValidate', name: 'globalLock'})
        return Taro.navigateTo({
          url: '/pages/Lock/AuthLock/index',
        })
      }

      // 都关闭的时候，关闭总开
      dispatch({type: 'global/setIsLock', isLock: false});

    }
  }
  
  function switchFingerprintLock(lock) {
    authFingerprintLock(() => {
      if (isLock) {  // 总开关开着，才能关
        dispatch({type: 'global/setIsFingerprintLock', isFingerprintLock: lock})
      }
    }, () => {
      Taro.showToast({
        title: '当前设备暂不支持指纹解锁',
        icon: 'none',
        duration: 2000
      })
    })
  }

  function switchNinecaseLock(lock) {
    const lockPwd = Taro.getStorageSync('gesturePwd');

    if (lock) {

      // 有密码，直接开启
      if (lockPwd.length) {
        dispatch({type: 'global/setIsNinecaseLock', isNinecaseLock:true});
      } else {
        // 无密码，设置密码
        Taro.navigateTo({
          url: '/pages/Lock/AuthLock/index'
        })
      }
    } else if (isLock){  // 总开关开着，才能关
      dispatch({type: 'global/setWhichValidate', name: 'ninecaseLock'})
      return Taro.navigateTo({
        url: '/pages/Lock/AuthLock/index',
      })
    }

  }
  return (
    <View>
      <AtForm>
        <AtSwitch title='是否启用密码锁' checked={isLock} onChange={switchLock} />
        <AtSwitch title='指纹锁' disabled={!isLock && isFingerprintLock} checked={isFingerprintLock} onChange={switchFingerprintLock} />
        <AtSwitch title='九宫格锁' disabled={!isLock && isNinecaseLock} checked={isNinecaseLock} onChange={switchNinecaseLock} />
      </AtForm>
    </View>
  )
}

Profile.config = {
  "navigationBarTitleText": "密码锁"
}