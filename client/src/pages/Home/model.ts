import Taro from '@tarojs/taro'
import {Model} from 'utils/dva'
import { PaginationParam, PageData, defPageData, defPaginationParams, Page, mergePagination } from 'hooks/usePagination/entity'
import { bookListApi, recommendBookApi } from './api'

export interface BookState {
  loading: boolean,
  increasing: boolean,
  params: PaginationParam,
  list: PageData<book.Item>
}

export default {
  namespace: 'book',
  state: {
    loading: true,
    increasing: false,
    params: defPaginationParams,
    list: defPageData
  },
  effects: {
    *fetchList({payload}, {call, put, select}) {
      const book: BookState = yield select(({book}) => book);
      const { params, list: curList } = book;
      const def: PaginationParam = payload ? { ...params, ...payload } : params;

      if (def.current && def.current > 1) {
        yield put({type: 'increasing', payload: true})
      }
      yield put({type: 'updateParams', payload: def})
      yield put({type: 'loading', payload: true})
      
      try {
        const res = yield call(bookListApi, def);
        const list: Page<book.Item> = res.data;
        const _list = mergePagination(curList!, list);
        yield put({
          type: 'updateList',
          payload: _list
        })
        Taro.stopPullDownRefresh();
      } catch (e) {
        Taro.showToast({title: e.message});
        yield put({ type: 'increasing', payload: false })
        yield put({type: 'loading', payload: false})
      }
    },
    *recommend({payload}, {call, put}) {
      const {book} = payload;
      try {
        yield put({
          type: 'addRecommend',
          payload
        })
        yield call(recommendBookApi, book._id);
        Taro.showToast({
          title: '已点赞',
          icon:'success'
        })
        // TODO 调用新增推荐的接口
      } catch(e) {

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
    addRecommend(state, action: any) {
      const {index, book} = action.payload;
      const list = state.list.list;
      list[index] = book;
      return {
        ...state,
        list: {
          ...state.list,
          list: [...list]
        }
      }
    }
  }
} as Model<BookState>