/** 
 * 存储密码所需的所有信息
 */
import { Model } from "utils/dva";

export interface AccountState {
  isLogin: boolean;
  counter: number
}

export default {
  namespace: "account",
  state: {
    isLogin: false,
    counter: 0
  },
  effects: {
    *increment(_, {put}) {
      yield put({type: 'add'});
    },
    *decrement(_, {put}) {
      yield put({type: 'reduce'});
    }
  },
  reducers: {
    add: (state) => ({
      ...state,
      counter: state.counter + 1
    }),
    reduce: (state) => ({
      ...state,
      counter: state.counter - 1
    })
  }
} as Model<AccountState>;
