import Taro, { useEffect } from "@tarojs/taro";
import { useSelector, useDispatch } from "@tarojs/redux";
import { View } from "@tarojs/components";

import DrawUnlock from "pages/DrawUnlock";
import FingerprintLock from "pages/FingerprintLock";
import Accounts from "pages/Accounts";

export default function SwitchPage () {
  console.log('run')
  const { isFirstUse, isLock, isFingerprintLock, isLocking } = useSelector<any, GlobalState>(state => state.global);
  const dispatch = useDispatch();

  useEffect(() => {
    // 首次使用
    if (isFirstUse) {
      Taro.checkIsSupportSoterAuthentication({
        success(res) {
          if (res.supportMode.indexOf('fingerPrint') > -1 && !global.isNinecaseLock) {
            dispatch({type: 'global/setIsLock', isLock: true})
            dispatch({type: 'global/setIsFingerprintLock', isFingerprintLock: true})
          }
        }
      })

      dispatch({type: 'global/setIsFirstUse', isFirstUse: false})
    }
  }, [])

  return (
    <View>
      {
        (isLock && isLocking) ? (
          isFingerprintLock ? <FingerprintLock></FingerprintLock>
          : <DrawUnlock></DrawUnlock>
        ) : <Accounts></Accounts>
      }
    </View>
  )
}