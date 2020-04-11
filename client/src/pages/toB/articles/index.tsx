import Taro, {Config, useEffect, usePullDownRefresh, useReachBottom, useRouter} from "@tarojs/taro";
import {View, Image, Text, Input, Button} from "@tarojs/components";
import { useSelector, useDispatch } from '@tarojs/redux';
import { ArticleState } from 'pages/toB/articles/model';
import PaginationProvider from 'components/PaginationProvider';
import debounce from 'lodash/debounce';
import "./index.scss";
import { PaginationParam } from 'hooks/usePagination/entity';

export default function Articles() {
  const {params, list, increasing, loading} = useSelector<any, ArticleState>(state => state.article);
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    const def: PaginationParam = { pageSize: 20, current: 1 }
    const {gzhaoId} = router.params
    if (gzhaoId) {
      def.gzhaoId = gzhaoId
    }
    if (list.list.length == 0 || params.gzhaoId != gzhaoId) {
      dispatch({
        type: 'article/fetchList', 
        payload: def
      })
    }
  }, []);

  usePullDownRefresh(() => {
    dispatch({
      type: 'article/fetchList',
      payload: { current: 1 }
    })
  })

  useReachBottom(() => {
    if (!list.pagination.lastPage) {
      dispatch({
        type: 'article/fetchList',
        payload: { current: list.pagination.current + 1 }
      })
    }
  })

  const searchHandler = debounce((value: string) => {
    dispatch({
      type: 'article/fetchList',
      payload: {keyword: value, current: 1}
    })
  }, 600)

  const add = () => {
    dispatch({
      type: 'article/info',
      payload: 'reset'
    })
    Taro.navigateTo({url: '/pages/toB/articles/subpages/Editor/index'})
  }

  const editor = (article: article.Item) => {
    dispatch({
      type: 'article/info',
      payload: article
    })
    Taro.navigateTo({ url: '/pages/toB/articles/subpages/Editor/index' })
  }

  return (
    <View className="container">
      <View className="search_wrap">
        <Input className="searchbar" placeholder="搜索" onInput={(e) => searchHandler(e.detail.value)} />
        <Button className="add" onClick={add}>新增</Button>
      </View>
      <PaginationProvider
        length={list.list.length}
        lastPage={!!list.pagination.lastPage}
        increasing={increasing}
        loading={loading}
      >
        {list.list.map((item) => (
          <View key={item._id} className="item_wrap">
            <View className="top_warp" onClick={() => editor(item)}>
              <View className="top_left">
                <Image className="gzhaoImg" src={item.subscription!.logo!} mode="aspectFit" />
                <Text className="gzhaoName">{item.subscription!.name}</Text>
              </View>
              <View className="top_right time">{item.time}</View>
            </View>
            <View className="content_wrap" onClick={() => Taro.navigateTo({ url: `/pages/webview/index?url=${item.url}` })}>
              <View className="content_left">
                <View className="title">{item.title}</View>
                <View className="xinfo">
                  <Text className="author">{item.subscription!.author}</Text>
                  {item.original && <Text className="tag">原创</Text>}
                </View>
              </View>
              {item.thumb && (
                <View className="content_right">
                  <Image className="thumb" src={item.thumb!} mode="aspectFill" />
                </View>
              )}
            </View>
          </View>
        ))}
      </PaginationProvider>
    </View>
  );
}

Articles.config = {
  navigationBarTitleText: "文章管理",
  enablePullDownRefresh: true,
  navigationBarBackgroundColor: '#ededed',
  backgroundColor: '#ededed'
} as Config;
