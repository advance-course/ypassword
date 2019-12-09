import { Model } from "utils/dva";

export interface LoginState {
  isLogin: boolean;
  counter: number
}

export default {
  namespace: "login",
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
} as Model<LoginState>;
