/** 
 * 存储密码所需的所有信息
 */
import Taro from "@tarojs/taro";
import { Model } from "utils/dva";
import { deleteAccountApi, accountsListApi, asyncAccountApi } from 'pages/Accounts/api';
import { GlobalState } from 'store/global';

export interface AccountState {
  uuids: string[],
  accounts: {[key: string]: com.Account},
  curAccount: com.Account,
  syncing: boolean
}

export default {
  namespace: "account",
  state: {
    uuids: [],
    accounts: {},
    curAccount: {},
    syncing: false
  },
  effects: {
    *init({payload}, {call, put, select}) {
      const ids = Taro.getStorageSync('accounts_ids') || []
      const accounts = {}
      const {userId}: GlobalState = yield select(({global}) => global)
      
      if (ids.length > 0) {
        ids.forEach(id => {
          accounts[id] = Taro.getStorageSync(id)
        })
      }

      if (ids.length == 0) {
        const {data = []} = yield call(accountsListApi, userId)
        data.forEach((account: com.Account) => {
          ids.push(account.uuid!)
          accounts[account.uuid!] = account
          Taro.setStorageSync(account.uuid!, account)
        })

        Taro.setStorageSync('accounts_ids', ids)
      }

      yield put({
        type: 'initial',
        payload: {
          uuids: ids,
          accounts
        }
      })
    },
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
    },
    *sync(action, {select, call, put}) {
      yield put({type: 'syncing', payload: true})
      const { userId }: GlobalState = yield select(({ global }) => global)
      const { uuids, accounts }: AccountState = yield select(({ account}) => account)
      try {
        const { data = [] } = yield call(accountsListApi, userId)

        uuids.forEach(id => {
          const i = data.findIndex((item: com.Account) => item.uuid == id)
          if (i >= 0) { // 替换
            data.splice(i, 1, accounts[id])
          } else { // 新增
            data.push(accounts[id])
          }
        })

        const _uuids: string[] = []
        const _accounts = {}

        data.forEach((item: com.Account) => {
          _uuids.push(item.uuid!)
          _accounts[item.uuid!] = item
          Taro.setStorageSync(item.uuid!, item)
        })

        Taro.setStorageSync('accounts_ids', _uuids)

        yield call(asyncAccountApi, {
          keys: _uuids,
          account: _accounts
        })
        

        Taro.showToast({ title: '同步成功', icon: 'success' })
        yield put({ type: 'syncing', payload: false })
        yield put({type: 'initial', payload: {
          uuids: _uuids,
          accounts: _accounts
        }})
      } catch (e) {
        Taro.showToast({title: '更新失败', icon: 'none'})
        yield put({ type: 'syncing', payload: false })
      }
    }
  },
  reducers: {
    initial: (state, action) => {
      return {
        ...state,
        ...action.payload
      }
    },
    syncing(state, action) {
      return {
        ...state,
        syncing: action.payload
      }
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
