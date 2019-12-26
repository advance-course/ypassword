/** 
 * 存储密码所需的所有信息
 */
import { Model } from "utils/dva";
import {accounts} from './entity';

export interface AccountState {
  accounts: com.Account[],
  counter: number
}

export default {
  namespace: "account",
  state: {
    accounts,
    counter: 0
  },
  effects: {
    *addAccount({payload}, {put}) {
      yield put({type: 'add', payload});
    },
    *decrement(_, {put}) {
      yield put({type: 'reduce'});
    }
  },
  reducers: {
    add: (state, action: any) => ({
      ...state,
      accounts: [...state.accounts, action.payload]
    }),
    reduce: (state, action: any) => ({
      ...state,
      counter: state.counter - 1
    })
  }
} as Model<AccountState>;
