import Taro from '@tarojs/taro';
import { View, Label, Image } from '@tarojs/components';
import { AtForm, AtSwitch } from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';
import './index.scss';
import { SetBooleanStatus } from 'store/global';

export default function Profile() {
  const global = useSelector<any, SetBooleanStatus>(state => state.global)
  const dispatch = useDispatch()

  function switchLock(isLock) {
    dispatch({type: 'global/setIsLock', isLock})
  }
  
  function switchFingerprintLock(isFingerprintLock) {

    Taro.checkIsSupportSoterAuthentication({
      success(res) {
        if (!res.supportMode.length) {
          return Taro.showToast({
            title: '您的设备暂不支持该功能',
            icon: 'success',
          })
        }

        if (isFingerprintLock === true) {
          Taro.startSoterAuthentication({
            requestAuthModes: ['fingerPrint'],
            challenge: '123456',
            authContent: '请用指纹解锁',
            success(res) {
              if (global.isNinecaseLock) {
                dispatch({type: 'global/setIsNinecaseLock', isNinecaseLock: false})
              }
              dispatch({type: 'global/setIsFingerprintLock', isFingerprintLock})
            }
        })
        } else {
          dispatch({type: 'global/setIsFingerprintLock', isFingerprintLock})
        }
      }
    })

  }

  function switchNinecaseLock(isNinecaseLock) {
    if(isNinecaseLock === true) {
      Taro.navigateTo({
        url: '/pages/DrawUnlock/index'
      })
    } else {
      dispatch({type: 'global/setIsNinecaseLock', isNinecaseLock})
    }

  }

  return (
    <View>
      <AtForm>
        <AtSwitch title='是否启用密码锁' checked={global.isLock} onChange={switchLock} />
        <AtSwitch title='指纹锁' checked={global.isFingerprintLock} onChange={switchFingerprintLock} />
        <AtSwitch title='九宫格锁' checked={global.isNinecaseLock} onChange={switchNinecaseLock} />
      </AtForm>
    </View>
  )
}

Profile.config = {
  "navigationBarTitleText": "密码锁"
}