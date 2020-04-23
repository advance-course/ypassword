/**
 * 存储密码所需的所有信息
 */
import Taro from '@tarojs/taro'
import { Model, ActionWithPayload } from "utils/dva";
import JSEncrypt from 'utils/rsa';
import {getSystemInfo} from 'utils'
import { SystemInfo } from 'utils/fp/getSystemInfo';
import { UserInfo, loginApi, userUpdateApi } from 'pages/index/api';

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
  crypt: typeof crypt,
  password?: string,
  systemInfo: SystemInfo,
  userInfo: UserInfo
}

export interface SetBooleanStatus extends ActionWithPayload {
  [lock:string]: any
}

export default {
  namespace: "global",
  state: {
    userId: '',
    isFirstEnter: true,
    isLock: getStorage('isLock') || false,
    isFingerprintLock: getStorage('isFingerprintLock') || false,
    isNinecaseLock: getStorage('isNinecaseLock') || false,
    isLocking: true,
    password: '',
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
          yield put({ type: 'init', payload: res.data })
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
    },
    *updatePassword(action, {call, put, select}) {
      const {userId}: GlobalState = yield select(({global}) => global)
      const fn = () => {
        userUpdateApi(userId, action.payload)
      }
      
      try {
        yield call(fn)
        if (action.payload.password) {
          yield put({ type: 'password', payload: action.payload.password })
        }
      } catch (e) {
        console.log(e.message)
      }
    }
  },
  reducers: {
    init(state, action) {
      const u: UserInfo = action.payload
      return {
        ...state,
        isFingerprintLock: u.isFingerprintLock || false,
        isNinecaseLock: u.isNinecaseLock || false,
        userId: u._id,
        isFirstEnter: false,
        userInfo: u,
        isLock: u.isLock || false,
        isLocking: true,
        password: u.password || ''
      }
    },
    // 是否启用加锁，与指纹解锁和九宫格解锁联动
    isLock: (state, action) => {
      userUpdateApi(state.userId, {
        isLock: action.payload
      })
      return {
        ...state,
        isLock: action.payload
      }
    },
    isLocking: (state, action) => {
      return {
        ...state,
        isLocking: action.payload
      }
    },

    isFingerprintLock(state, action) {
      setStorage('isFingerprintLock', action.payload)
      
      // 当开启时
      if (action.payload) {
        // 关闭手势锁，打开总开关
        setStorage('isNinecaseLock', false)
        setStorage('isLock', true)

        userUpdateApi(state.userId, {
          isFingerprintLock: action.payload,
          isNinecaseLock: false,
          isLock: true
        })
        
        return {
          ...state,
          isFingerprintLock: true,
          isNinecaseLock: false,
          isLock: true
        }
      }

      userUpdateApi(state.userId, {
        isFingerprintLock: action.payload,
      })
      return {
        ...state,
        isFingerprintLock: false,
      }
    },

    isNinecaseLock(state, action) {
      setStorage('isNinecaseLock', action.payload)

      // 当开启时
      if (action.payload) {
        // 关闭指纹锁，打开总开关
        setStorage('isFingerprintLock', false)
        setStorage('isLock', true)

        userUpdateApi(state.userId, {
          isFingerprintLock: false,
          isNinecaseLock: true,
          isLock: true
        })
        
        return {
          ...state,
          isFingerprintLock: false,
          isNinecaseLock: true,
          isLock: true
        }
      }

      userUpdateApi(state.userId, {
        isNinecaseLock: false
      })

      return {
        ...state,
        isNinecaseLock: false,
      }
    },

    password(state, action) {
      return {
        ...state,
        password: action.payload
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
