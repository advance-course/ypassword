/**
 * 缓存用户信息
 */
import { Model } from "utils/dva";
import { UserInfo } from 'pages/index/api';

export interface ToBUserinfo {
  currentUser: UserInfo
}

export default {
  namespace: "toBUserinfo",
  state: {
    currentUser: {} as UserInfo
  },
  effects: {
  },
  reducers: {
    setUserInfo: (state, action: any) => ({
      ...state,
      currentUser: action.payload
    })
  }
} as Model<ToBUserinfo>;
