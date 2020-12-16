import Taro from '@tarojs/taro'
import { Model } from 'utils/dva'
import { PaginationParam, PageData, defPageData, defPaginationParams, Page, mergePagination } from 'hooks/usePagination/entity'
import { articleAddApi, articleUpdateApi } from 'pages/toB/articles/api'
import { subscriptitonListApi } from 'pages/Feeds/api'

export interface FeedsState {
  loading: boolean,
  increasing: boolean,
  params: PaginationParam,
  followList: subscribe.Info[], // 关注的公众号列表
  list: PageData<subscribe.Info>, // 所有公众号列表
  info: subscribe.Info // 当前选中的公众号
}

export default {
  namespace: 'feeds',
  state: {
    loading: true,
    increasing: false,
    followList: [],
    params: defPaginationParams,
    list: defPageData,
    info: {}
  },
  effects: {
    *fetchList({ payload }, { call, put, select }) {
      const feeds: FeedsState = yield select(({ feeds }) => feeds);
      const { params, list: curList } = feeds;
      const def: PaginationParam = payload ? { ...params, ...payload } : params;

      Taro.showLoading({title: '加载中...'})

      if (def.current && def.current > 1) {
        yield put({ type: 'increasing', payload: true })
      }
      yield put({ type: 'updateParams', payload: def })
      yield put({ type: 'loading', payload: true })

      try {
        const res = yield call(subscriptitonListApi, def);
        const list: Page<article.Item> = res.data;
        const _list = mergePagination(curList!, list);
        yield put({
          type: 'updateList',
          payload: _list
        })
        Taro.hideLoading()
      } catch (e) {
        Taro.showToast({ title: e.message });
        yield put({ type: 'increasing', payload: false })
        yield put({ type: 'loading', payload: false })
        Taro.hideLoading()
      }
    },
    *add({ payload }, { call }) {
      Taro.showLoading({ title: '新增中...' })
      try {
        yield call(articleAddApi, payload)
        Taro.hideLoading()
        Taro.showToast({ title: '添加成功', icon: 'success' })
        Taro.navigateBack()
      } catch (e) {
        Taro.hideLoading()
        Taro.showToast({ title: e.message })
      }
    },
    *update({ payload }, { call }) {
      Taro.showLoading({ title: '更新中...' })
      try {
        yield call(articleUpdateApi, payload)
        Taro.hideLoading()
        Taro.showToast({ title: '更新成功', icon: 'success' })
      } catch (e) {
        Taro.hideLoading()
        Taro.showToast({ title: e.message })
      }
    }
  },
  reducers: {
    updateList(state, action: any) {
      return {
        ...state,
        list: action.payload,
        increasing: false,
        loading: false
      }
    },
    loading(state, action: any) {
      return {
        ...state,
        loading: action.payload
      }
    },
    increasing(state, action: any) {
      return {
        ...state,
        increasing: action.payload
      }
    },
    updateParams(state, action: any) {
      return {
        ...state,
        params: action.payload
      }
    },
    info(state, action) {
      let info = {}
      if (action.payload != 'reset') {
        info = { ...state.info, ...action.payload }
      }
      return { ...state, info }
    }
  }
} as Model<FeedsState>