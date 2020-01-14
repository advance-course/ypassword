/**
 * 存储密码所需的所有信息
 */
import Taro from '@tarojs/taro'
import { Model } from "utils/dva";

function getStorage(key:string):any {
  return Taro.getStorageSync(key)
}

function setStorage(key:string, value:any):void {
  Taro.setStorageSync(key, value)
}

export interface GlobalState {
  // 用户id
  userId: string,
  // 首次使用
  isFirstUse: true,
  // 每次退出后的首次进入
  isFirstEnter: boolean,
  /** 是否启用指纹解锁 */
  isFingerprintLock: boolean,
  /** 是否启用加锁功能 */
  isLock: boolean,
  /** 是否九宫格锁 */
  isNinecaseLock: boolean,
  /** app当前是否处于加锁状态 */
  isLocking: boolean
}

export interface setUserId {
  type: string,
  userId: string,
}

export interface SetBooleanStatus {
  type: string,
  [lock:string]: any
}

export default {
  namespace: "global",
  state: {
    userId: '',
    isFirstEnter: true,
    isFirstUse: getStorage('isFirstUse') === '' ? true : getStorage('isFirstUse'),
    isLock: getStorage('isLock') || false,
    isFingerprintLock: getStorage('isFingerprintLock') || false,
    isNinecaseLock: getStorage('isNinecaseLock') || false,
    isLocking: true,
  },
  effects: {
  },
  reducers: {
    setLockingStatus: (state, action: any) => ({
      ...state,
      isLocking: action.isLocking,
    }),
    setUserId(state:GlobalState, action:setUserId) {
      return {
        ...state,
        userId: action.userId
      }
    },
    setIsFirstUse(state:GlobalState, action:SetBooleanStatus) {
      setStorage('isFirstUse', action.isFirstUse)

      return {
        ...state,
        isFirstUse: action.isFirstUse
      }
    },
    setIsLock(state:GlobalState, action:SetBooleanStatus) {
      setStorage('isLock', action.isLock)

      return {
        ...state,
        isLock: action.isLock
      }
    },
    setIsFirstEnter(state:GlobalState, action:SetBooleanStatus) {
      return {
        ...state,
        isFirstEnter: action.isFirstEnter
      }
    },
    setIsFingerprintLock(state:GlobalState, action:SetBooleanStatus) {
      setStorage('isFingerprintLock', action.isFingerprintLock)

      return {
        ...state,
        isFingerprintLock: action.isFingerprintLock
      }
    },
    setIsNinecaseLock(state:GlobalState, action:SetBooleanStatus) {
      setStorage('isNinecaseLock', action.isNinecaseLock)

      return {
        ...state,
        isNinecaseLock: action.isNinecaseLock
      }
    },
    setIsLocking(state:GlobalState, action:SetBooleanStatus) {
      return {
        ...state,
        isLocking: action.isLocking
      }
    },
  }
} as Model<GlobalState>;
