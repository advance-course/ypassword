import Taro from '@tarojs/taro'
import { Model } from 'utils/dva'
import { PaginationParam, PageData, defPageData, defPaginationParams, Page, mergePagination } from 'hooks/usePagination/entity'
import { articleListApi, articleAddApi, articleUpdateApi } from 'pages/toB/articles/api'

export interface ArticleState {
  loading: boolean,
  increasing: boolean,
  params: PaginationParam,
  list: PageData<article.Item>,
  info: article.Item
}

export default {
  namespace: 'feed',
  state: {
    loading: true,
    increasing: false,
    params: defPaginationParams,
    list: defPageData,
    info: {}
  },
  effects: {
    *fetchList({ payload }, { call, put, select }) {
      const article: ArticleState = yield select(({ article }) => article);
      const { params, list: curList } = article;
      const def: PaginationParam = payload ? { ...params, ...payload } : params;

      if (def.current && def.current > 1) {
        yield put({ type: 'increasing', payload: true })
      }
      yield put({ type: 'updateParams', payload: def })
      yield put({ type: 'loading', payload: true })

      try {
        const res = yield call(articleListApi, def);
        const list: Page<article.Item> = res.data;
        const _list = mergePagination(curList!, list);
        yield put({
          type: 'updateList',
          payload: _list
        })
        Taro.stopPullDownRefresh();
      } catch (e) {
        Taro.showToast({ title: e.message });
        yield put({ type: 'increasing', payload: false })
        yield put({ type: 'loading', payload: false })
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
} as Model<ArticleState>