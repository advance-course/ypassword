import Taro, { Config, useRouter } from '@tarojs/taro';
import { View } from '@tarojs/components'
import { useDispatch, useSelector } from '@tarojs/redux';

import GestureLock from '../../../components/GestureLock'
import { GlobalState } from 'store/global';

const _value = {
  true: true,
  false: false
}

export default function AuthLock() {
  const router = useRouter()
  const dispatch = useDispatch();
  const {password} = useSelector<any, GlobalState>(state => state.global)

  const {status, value} = router.params

  function closeLock() {
    dispatch({
      type: `global/${status}`,
      payload: _value[value]
    })
    Taro.navigateBack()
  }

  function forgetPwd() {
    Taro.redirectTo({
      url: '/pages/Lock/PasswordRest/index'
    })
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
  
  return (
    <View>
      <GestureLock
        lockPwd={password}
        closeLock={closeLock}
        forgetPwd={forgetPwd}
        setLockPwd={setLockPwd}
      />
    </View>
  )
}

AuthLock.config = {
  disableScroll: true,
  navigationBarTitleText: '手势解锁',
} as Config
