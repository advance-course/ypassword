import Taro, { useEffect } from "@tarojs/taro";
import { useSelector, useDispatch } from "@tarojs/redux";

import Accounts from "pages/Accounts/index";
import { GlobalState } from "store/global";

export default function SwitchPage () {
  const { isFirstUse, isLock, isFingerprintLock, isNinecaseLock, isLocking } = useSelector<any, GlobalState>(state => state.global);
  const dispatch = useDispatch();

  useEffect(() => {
    // 首次使用
    if (isFirstUse) {
      Taro.checkIsSupportSoterAuthentication({
        success(res) {
          if (res.supportMode.indexOf('fingerPrint') > -1 && !isNinecaseLock) {
            dispatch({type: 'global/setIsLock', isLock: true});
            dispatch({type: 'global/setIsFingerprintLock', isFingerprintLock: true});
          }
        }
      })

      dispatch({type: 'global/setIsFirstUse', isFirstUse: false});
    }
  }, [])

  useEffect(() => {
    if (isLock && isLocking) {
      isFingerprintLock && Taro.redirectTo({url: '/pages/Lock/FingerprintLock/index'});
      isNinecaseLock && Taro.redirectTo({url: '/pages/Lock/DrawUnlock/index'});
    }
  }, [])

  return (
    !isLocking && <Accounts></Accounts>
  )
}