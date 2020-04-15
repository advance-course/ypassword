import Taro from "@tarojs/taro";
import { Model } from "utils/dva";
import { queryCategoryListApi, delCategoryApi, updateCategoryApi, addCategoryApi } from "./api";

export interface category {
  _id: string,
  name: string,
  imgUrl: string
}

export interface CategoryState {
  list: category[],
  current: category,
  loading: Boolean
}

export default {
  namespace: 'category',
  state: {
    list: [],
    current: {
      _id: '',
      name: '',
      imgUrl: ''
    },
    loading: true
  },
  effects: {
    *add ({payload}, {put, call}) {
      Taro.showLoading({ title: '正在添加...' })
      try {
        const res = yield call(addCategoryApi, payload);
        console.log('add res', res)
        Taro.navigateBack();
      } catch (e) {
      }
    },
    *del ({payload}, {call}) {
      try {
        yield call(delCategoryApi, payload)
        Taro.showToast({title: '删除成功', icon: 'success'})
      } catch (e) {
      }
    },
    *update ({payload}, {put, call}) {
      try {
        yield call(updateCategoryApi, payload)
        Taro.showToast({title: '更新成功', icon: 'success'})
        Taro.navigateBack();
      } catch (e) {}
    },
    *getList ({payload}, {put, call}) {
      Taro.showLoading({ title: '加载中...' })
      try {
        const res = yield call(queryCategoryListApi, payload)
        yield put({
          type: 'setCategoryList',
          payload: res.data.data
        })
        Taro.hideLoading()
      } catch (e) {
        Taro.hideLoading()
      }
    }
  },
  reducers: {
    setCategoryList: (state, action: any) => {
      return {
        ...state,
        list: action.payload
      }
    },
    save: (state, action: any) => {
      return state
    }
  }
} as Model<CategoryState>;
