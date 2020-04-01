/** 
 * 存储密码所需的所有信息
 */
import Taro from "@tarojs/taro";
import { Model } from "utils/dva";

export interface AccountState {
  uuids: string[],
  accounts: {[key: string]: com.Account},
  counter: number
}

export default {
  namespace: "account",
  state: {
    uuids: [],
    accounts: {},
    counter: 0
  },
  effects: {
    *addAccount({payload}, {put}) {
      yield put({type: 'add', payload});
      Taro.navigateBack();
    },
    *decrement(_, {put}) {
      yield put({type: 'reduce'});
    }
  },
  reducers: {
    add: (state, action: any) => {
      let ids = state.uuids
      const {payload} = action
      if (!ids.includes(payload.uuid)) {
        ids = [...state.uuids, payload.uuid]
      }
      return {
        ...state,
        uuids: ids,
        accounts: {
          ...state.accounts,
          [action.payload.uuid]: action.payload
        }
      }
    },
    reduce: (state, action: any) => ({
      ...state,
      counter: state.counter - 1
    })
  }
} as Model<AccountState>;
