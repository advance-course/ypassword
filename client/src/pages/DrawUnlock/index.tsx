import Taro, { Config } from '@tarojs/taro';
import { View } from '@tarojs/components'
import { useSelector, useDispatch } from '@tarojs/redux';

import GestureLock from '../../components/GestureLock'
import { SetBooleanStatus } from 'store/global';
import './index.scss';

interface DrawUnlockProps {};
export default function DrawUnlock(props):DrawUnlockProps {
  const global = useSelector<any, SetBooleanStatus>(state => state.global)
  const dispatch = useDispatch();

  const lockPwd = Taro.getStorageSync('gesture');

  function closeLock() {
    dispatch({type: 'global/setIsLocking', isLocking: false})
  }

  function setLockPwd(pwd) {
    Taro.setStorageSync('gesture', pwd);

    if (global.isFingerprintLock) {
      dispatch({type: 'global/setIsFingerprintLock', isNinecaseLock: false})
    };

    dispatch({type: 'global/setIsNinecaseLock', isNinecaseLock:true});

  }
  console.log(global.isNinecaseLock)
  return (
    <View>
      <GestureLock
        lockPwd={lockPwd}
        isLocking={global.isNinecaseLock}
        closeLock={closeLock}
        setLockPwd={setLockPwd}
      />
    </View>
  )
}

DrawUnlock.config = {
  disableScroll: true,
  navigationBarTitleText: '手势解锁',
} as Config
