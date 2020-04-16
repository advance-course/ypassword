import Taro, { useEffect } from '@tarojs/taro';
import classnames from 'classnames'
import { View, Swiper, SwiperItem, Text, Image } from '@tarojs/components';
import { useDispatch, useSelector } from '@tarojs/redux';
import { BookState } from 'pages/Home/model';
import MyIcon from 'components/myIcon';
import "./index.scss";

export default function Index() {
  const dispatch = useDispatch()
  const {list} = useSelector<any, BookState>(state => state.book)

  useEffect(() => {
    if (list.list.length == 0) {
      dispatch({
        type: 'book/fetchList',
        payload: {current: 1}
      })
    }
  }, [])

  function recommendHandler(index: number, book: book.Item) {
    if (book.isRecommend) {
      return;
    }
    book.isRecommend = true;
    book.recommend = book.recommend! + 1;
    dispatch({
      type: 'book/recommend',
      payload: { index, book }
    })
    console.log(index, book);
  }

  function navToBookinfo(book: book.Item) {
    dispatch({
      type: 'book/fetchArticleByBook',
      payload: book
    })
    Taro.navigateTo({
      url: '/pages/Home/bookinfo/index'
    })
  }

  return (
    <View className="container">
      {list.list.length ? (
        <Swiper className="content" previous-margin={30} next-margin={30}>
          {list.list.map((book, i) => (
            <SwiperItem className="book" key={book._id}>
              <View className="inner_wrap">
                <View className="top" onClick={() => navToBookinfo(book)}>
                  <Image className="cover" src={book.cover!} mode="aspectFill" />
                  <View className="name">{book.name}</View>
                </View>
                
                <View className="bottom">
                  <Image className="author_avatar" src={book.subscription!.logo!} mode="aspectFill" />
                  <View className="author">{book.subscription!.author}</View>
                  <View className="recommend_warp" onClick={() => recommendHandler(i, book)}>
                    <MyIcon name="heart" size={30} color={book.isRecommend ? "red" : '#999999'} style={{fontWeight: 'bold'}} />
                    <Text className={classnames('recommend', {active: book.isRecommend})}>{book.recommend || 0}</Text>
                  </View>
                </View>
              </View>
            </SwiperItem>
          ))}
        </Swiper>
      ) : null}
    </View>
  );
}
