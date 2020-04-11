import Taro from '@tarojs/taro'
import { Model } from 'utils/dva'
import { subscriptionAddApi, subscriptionInfoApi } from './api'

export interface SubscriptionState {
  info: subscribe.Info,
  loading: boolean,
}

export default {
  namespace: 'subscription',
  state: {
    info: {},
    loading: true
  },
  effects: {
    *fetchInfo({ payload }, { call, put }) {
      try {
        const res = yield call(subscriptionInfoApi, payload);
        yield put({
          type: 'info',
          payload: res.data
        })
      } catch (e) {
        Taro.showToast({ title: e.message });
        yield put({type: 'loading', payload: false})
      }
    },
    *add({ payload }, { call, put }) {
      Taro.showLoading({title: '保存中...'})
      try {
        yield call(subscriptionAddApi, payload);
        yield put({
          type: 'info',
          payload
        })
        Taro.hideLoading()
        Taro.showToast({
          title: '保存成功',
          icon: 'success'
        })
      } catch (e) {
        Taro.hideLoading()
        Taro.showToast({ title: e.message });
      }
    }
  },
  reducers: {
    info(state, action: any) {
      return {
        ...state,
        info: action.payload,
        loading: false
      }
    },
    loading(state, action: any) {
      return {
        ...state,
        loading: action.payload
      }
    },
  }
} as Model<SubscriptionState>