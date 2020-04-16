import Taro from "@tarojs/taro";
import { Model } from "utils/dva";
import { queryCategoryListApi, delCategoryApi, updateCategoryApi, addCategoryApi } from "./api";
import { GlobalState } from 'store/global';

export interface CategoryState {
  list: category.Info[],
  defList: category.Info[]
  current: category.Info,
  loading: Boolean
}

export default {
  namespace: 'category',
  state: {
    list: [],
    defList: [],
    current: {},
    loading: true
  },
  effects: {
    *add ({payload}, {put, call, select}) {
      const global: GlobalState = yield select(({global}) => global)
      const { type } = payload

      Taro.showLoading({ title: '正在添加...' })
      try {
        yield call(addCategoryApi, payload);
        const res = yield call(queryCategoryListApi, {userid: global.userId, type})
        yield put({
          type: 'list',
          payload: {
            type,
            data: res.data
          }
        })
        Taro.hideLoading()
        Taro.showToast({
          title: '添加成功'
        })
        Taro.navigateBack();
      } catch (e) {
        Taro.hideLoading()
        Taro.showToast({
          title: e.message,
          icon: "none"
        })
      }
    },
    *del ({payload}, {call}) {
      Taro.showLoading({ title: '正在删除...' })
      try {
        yield call(delCategoryApi, payload)
        Taro.hideLoading()
        Taro.showToast({title: '删除成功', icon: 'success'})
      } catch (e) {
        Taro.showToast({
          title: e.message,
          icon: "none"
        })
      }
    },
    *update ({payload}, {put, call, select}) {
      const {type, data} = payload
      const category: CategoryState = yield select(({category}) => category)
      let _list: category.Info[] = []

      if (type == 1) {
        _list = category.list
      }
      if (type == 2) {
        _list = category.defList
      }
      const index = _list.findIndex(item => item._id == data._id)
      _list[index] = data
      Taro.showLoading({ title: '正在更新...' })
      try {
        yield call(updateCategoryApi, data)
        yield put({
          type: 'list',
          payload: {
            type,
            data: _list
          }
        })
        Taro.showToast({title: '更新成功', icon: 'success'})
        Taro.navigateBack();
      } catch (e) {}
    },
    *getList ({payload}, {put, call}) {
      const {type} = payload
      Taro.showLoading({ title: '加载中...' })
      try {
        const res = yield call(queryCategoryListApi, payload)
        yield put({
          type: 'list',
          payload: {
            type,
            data: res.data
          }
        })
        
        Taro.hideLoading()
      } catch (e) {
        Taro.hideLoading()
      }
    }
  },
  reducers: {
    list: (state, action) => {
      const {type, data} = action.payload
      if (type == 1) {
        return {
          ...state,
          list: data
        }
      }
      if (type == 2) {
        return {
          ...state,
          defList: data
        }
      }
    },

    current: (state, action) => {
      if (action.payload == 'reset') {
        return {
          ...state,
          current: {}
        }
      }
      return {
        ...state,
        current: {...state.current, ...action.payload}
      }
    }
  }
} as Model<CategoryState>;
