import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtForm, AtSwitch } from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';
import { SetBooleanStatus } from 'store/global';

export default function Profile() {
  const { isLock, isFingerprintLock, isNinecaseLock } = useSelector<any, SetBooleanStatus>(state => state.global)
  const dispatch = useDispatch()

  function switchLock(lock) {
  //   // 关闭锁要验证
    if (!lock) {
      if (isFingerprintLock) {
        Taro.startSoterAuthentication({
          requestAuthModes: ['fingerPrint'],
          challenge: '123456',
          authContent: '请用指纹解锁',
          success(res) {
            dispatch({type: 'global/setIsFingerprintLock', isFingerprintLock: lock})
          }
        })
      }

      if (isNinecaseLock) {
        return Taro.navigateTo({
          url: '/pages/Lock/AuthLock/index?wey=lock',
        })
      }
    } else {
      dispatch({type: 'global/setIsLock', lock})
    }
  }
  
  function switchFingerprintLock(lock) {
    Taro.startSoterAuthentication({
      requestAuthModes: ['fingerPrint'],
      challenge: '123456',
      authContent: '请用指纹解锁',
      success(res) {
        dispatch({type: 'global/setIsFingerprintLock', isFingerprintLock: lock})
      },
      fail() {
        Taro.showToast({
          title: '当前设备暂不支持指纹解锁',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

  function switchNinecaseLock(lock) {
    const lockPwd = Taro.getStorageSync('gesturePwd');

    if (lock) {
      if (lockPwd.length) {
        dispatch({type: 'global/setIsNinecaseLock', isNinecaseLock:true});
      } else {
        Taro.navigateTo({
          url: '/pages/DrawUnlock/index'
        })
      }
    } else {
      dispatch({type: 'global/setIsNinecaseLock', isNinecaseLock:false});
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