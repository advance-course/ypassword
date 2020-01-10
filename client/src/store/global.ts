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

const isLock = Taro.getStorageSync('isLock')
const isFingerprintLock = Taro.getStorageSync('isFingerprintLock')
const isNinecaseLock = Taro.getStorageSync('isNinecaseLock')
const isLocking = Taro.getStorageSync('isLocking')

export interface GlobalState {
  // 每次退出后的首次进入
  isFirstEnter: boolean,
  // 是否验证通过用户锁
  isVerified: boolean,
  /** 是否启用指纹解锁 */
  isFingerprintLock: boolean,
  /** 是否启用加锁功能 */
  isLock: boolean,
  /** 是否九宫格锁 */
  isNinecaseLock: boolean,
  /** app当前是否处于加锁状态 */
  isLocking: boolean
}

export interface SetBooleanStatus {
  type: string,
  [lock:string]: any
}

export default {
  namespace: "global",
  state: {
    isFirstEnter: true,
    isVerified: false,
    isLock: getStorage('isLock') || false,
    isFingerprintLock: getStorage('isFingerprintLock') || false,
    isNinecaseLock: getStorage('isNinecaseLock') || false,
    isLocking: getStorage('isLocking') || false,
  },
  effects: {

  },
  reducers: {
    setIsFirstEnter(state:GlobalState, action:SetBooleanStatus) {
      return {
        ...state,
        isFirstEnter: action.isFirstEnter
      }
    },
    setIsVerified(state:GlobalState, action:SetBooleanStatus) {
      console.log(action.isVerified)
      return {
        ...state,
        isVerified: action.isVerified
      }
    },
    setIsLock(state:GlobalState, action:SetBooleanStatus) {
      setStorage('isLock', action.isLock)

      return {
        ...state,
        isLock: action.isLock
      }
    },
    setIsFingerprintLock(state:GlobalState, action:SetBooleanStatus) {
      setStorage('userCisFingerprintLockonfig', action.isFingerprintLock)

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
      setStorage('isLocking', action.isLocking)

      return {
        ...state,
        isLocking: action.isLocking
      }
    },
  }
} as Model<GlobalState>;