/**
 * 存储密码所需的所有信息
 */
import Taro from '@tarojs/taro'
import { Model, ActionWithPayload } from "utils/dva";
import JSEncrypt from 'utils/rsa';
import {getSystemInfo} from 'utils'
import { SystemInfo } from 'utils/fp/getSystemInfo';
import { UserInfo, loginApi } from 'pages/index/api';

function getStorage(key:string):any {
  return Taro.getStorageSync(key)
}

function setStorage(key:string, value:any):void {
  Taro.setStorageSync(key, value)
}

const crypt = new JSEncrypt()

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
  isLocking: boolean,
  isValidate: boolean, // 验证是否通过
  whichValidate: string, // 哪个验证
  crypt: typeof crypt,
  systemInfo: SystemInfo,
  userInfo: UserInfo
}

export interface setUserId extends ActionWithPayload {
  userId: string,
}

export interface SetBooleanStatus extends ActionWithPayload {
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
    isValidate: false,  // 锁验证通过
    whichValidate: '',  // 哪个验证
    crypt,
    systemInfo: getSystemInfo(),
    userInfo: {} as UserInfo
  },
  effects: {
    *login(action, {call, put, select}) {
      const global: GlobalState = yield select(({global}) => global)
      try {
        if (global.isFirstEnter) {
          const res = yield call(loginApi)
          Taro.setStorageSync('userInfo', res.data)
          yield put({ type: 'userInfo', payload: res.data })
          yield put({ type: 'setIsFirstEnter', isFirstEnter: false})
          yield put({ type: 'setUserId', userId: res.data._id})
          const rsa = Taro.getStorageSync('rsa');
          if (!rsa || !res.data.publicKey) {
            Taro.setStorageSync('rsa', { publicKey: res.data.publicKey || '', privateKey: res.data.privateKey || '' })
          }
        }
        Taro.stopPullDownRefresh()
      } catch (e) {
        if ([401, 40101, 40102, 40103].includes(e.code)) {
          Taro.navigateTo({ url: '/pages/Auth/index' })
        }
      }
    }
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
      
      // 当开启时
      if (action.isFingerprintLock) {
        // 关闭手势锁，打开总开关
        setStorage('isNinecaseLock', false)
        setStorage('isLock', true)
        
        return {
          ...state,
          isFingerprintLock: true,
          isNinecaseLock: false,
          isLock: true
        }
      } else {
        return {
          ...state,
          isFingerprintLock: false,
        }
      }


    },
    setIsNinecaseLock(state:GlobalState, action:SetBooleanStatus) {
      setStorage('isNinecaseLock', action.isNinecaseLock)

      // 当开启时
      if (action.isNinecaseLock) {
        // 关闭指纹锁，打开总开关
        setStorage('isFingerprintLock', false)
        setStorage('isLock', true)
        
        return {
          ...state,
          isFingerprintLock: false,
          isNinecaseLock: true,
          isLock: true
        }
      } else {
        return {
          ...state,
          isNinecaseLock: false,
        }
      }
    },
    setIsLocking(state:GlobalState, action:SetBooleanStatus) {
      return {
        ...state,
        isLocking: action.isLocking
      }
    },
    setIsValidate(state:GlobalState, action:SetBooleanStatus) {
      return {
        ...state,
        isValidate: action.valid
      }
    },
    setWhichValidate(state:GlobalState, action:SetBooleanStatus) {
      return {
        ...state,
        whichValidate: action.name
      }
    },
    userInfo(state, {payload}) {
      return {
        ...state,
        userInfo: payload
      }
    }
  }
} as Model<GlobalState>;
