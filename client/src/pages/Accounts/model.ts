/** 
 * 存储密码所需的所有信息
 */
import Taro from "@tarojs/taro";
import { Model } from "utils/dva";
import { deleteAccountApi } from 'pages/Accounts/api';

export interface AccountState {
  uuids: string[],
  accounts: {[key: string]: com.Account},
  curAccount: com.Account
}

export default {
  namespace: "account",
  state: {
    uuids: [],
    accounts: {},
    curAccount: {}
  },
  effects: {
    *addAccount({payload}, {put}) {
      yield put({type: 'save', payload});
      Taro.navigateBack();
    },
    *removeAccount({payload}, {call, put}) {
      yield put({
        type: 'remove',
        payload
      })
      Taro.navigateBack()
      yield call(deleteAccountApi, payload.uuid)
    }
  },
  reducers: {
    init: (state) => {
      if (!state.uuids.length) {
        const ids = Taro.getStorageSync('accounts_ids') || [];
        const accounts = {}
        ids.forEach(id => {
          accounts[id] = Taro.getStorageSync(id);
        })
        console.log('从本地缓存初始化账户信息', ids, accounts);
        return { ...state, uuids: ids, accounts }
      }
      return state;
    },
    save: (state, action: any) => {
      let ids = state.uuids
      const {payload} = action
      if (!ids.includes(payload.uuid)) {
        ids = [...state.uuids, payload.uuid]
      }
      Taro.setStorageSync('accounts_ids', ids)
      Taro.setStorageSync(payload.uuid, payload)
      return {
        ...state,
        uuids: ids,
        accounts: {
          ...state.accounts,
          [action.payload.uuid]: action.payload
        }
      }
    },
    remove(state, action) {
      const account: com.Account = action.payload
      const _uuids = state.uuids
      const _accounts = state.accounts

      const index = state.uuids.findIndex(item => item == account.uuid)

      _uuids.splice(index, 1)
      delete _accounts[account.uuid!]
      Taro.removeStorageSync(account.uuid!)
      Taro.setStorageSync('accounts_ids', _uuids)

      return {
        ...state,
        curAccount: {},
        uuids: _uuids,
        accounts: _accounts
      }
    },
    accountInfo(state, action) {
      const {payload} = action
      if (payload == 'reset') {
        return {
          ...state,
          curAccount: {}
        }
      }
      return {
        ...state,
        curAccount: {...state.curAccount, ...payload}
      }
    }
  }
} as Model<AccountState>;
