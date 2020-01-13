/**
 * 存储密码所需的所有信息
 */
import { Model } from "utils/dva";

export interface GlobalState {
  /** 是否启用指纹解锁 */
  isFingerprintLock: boolean,
  /** 是否启用加锁功能 */
  isLock: boolean,
  /** 是否九宫格锁 */
  isNinecaseLock: boolean,
  /** app当前是否处于加锁状态 */
  isLocking: boolean
}

export default {
  namespace: "global",
  state: {
    isLock: true,
    isFingerprintLock: false,
    isNinecaseLock: true,
    isLocking: true
  },
  effects: {},
  reducers: {
    setLockingStatus: (state, action: any) => ({
      ...state,
      isLocking: action.isLocking,
    })
  }
} as Model<GlobalState>;
