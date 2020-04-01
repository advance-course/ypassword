import Taro from '@tarojs/taro'
/**
 * 缓存用户信息
 */
import { Model } from "utils/dva";
import { UserInfo, userUpdateApi } from 'pages/index/api';

export interface ToBUserinfo {
  currentUser: UserInfo
}

export default {
  namespace: "toBUserinfo",
  state: {
    currentUser: {} as UserInfo
  },
  effects: {
    *updateUserInfo(action, {call, put, select}) {
      try {
        Taro.showLoading({title: '更新中...'});
        const currentUser: UserInfo = yield select(({ toBUserinfo }) => toBUserinfo.currentUser)
        yield call(userUpdateApi, currentUser._id, action.payload);
        yield put({
          type: 'setUserInfo',
          payload: {...currentUser, ...action.payload}
        })
        Taro.hideLoading();
        Taro.showToast({ title: '更新成功', icon: 'success' });
      } catch (e) {
        Taro.showToast({title: e.message, icon: 'none'})
      }
    }
  },
  reducers: {
    setUserInfo: (state, action: any) => ({
      ...state,
      currentUser: action.payload
    })
  }
} as Model<ToBUserinfo>;
