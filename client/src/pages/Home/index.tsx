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
  }

  function navToBookinfo(index: number, book: book.Item) {
    dispatch({
      type: 'book/fetchArticleByBook',
      payload: book
    })
    dispatch({
      type: 'book/view',
      payload: {
        index, book
      }
    })
  }

  function navToComment(bookid: string) {
    Taro.navigateTo({
      url: `/pages/Home/comment/index?key=${bookid}`
    })
  }

  return (
    <View className="container">
      {list.list.length ? (
        <Swiper className="content" previous-margin={30} next-margin={30}>
          {list.list.map((book, i) => (
            <SwiperItem className="book" key={book._id}>
              <View className="inner_wrap" onClick={() => navToBookinfo(i, book)}>
                <View className="top">
                  <Image className="cover" src={book.cover!} mode="aspectFill" />
                  <View className="name">{book.name}</View>
                </View>

                <View className="bottom">
                  <Image className="author_avatar" src={book.subscription!.logo!} mode="aspectFill" />
                  <View className="author">{book.subscription!.author}</View>
                  <View className="icons">
                    
                    <View className="recommend_warp" onClick={(e) => { e.stopPropagation(); recommendHandler(i, book) }}>
                      <MyIcon name="heart" size={24} color={book.isRecommend ? "red" : '#999999'} style={{fontWeight: 'bold'}} />
                      <Text className={classnames('recommend', {active: book.isRecommend})}>{book.recommend || 0}</Text>
                    </View>

                    <View className="recommend_warp">
                      <MyIcon name="RectangleCopy238" size={24} color="#999999" style={{fontWeight: 'bold'}} />
                      <Text className="recommend">{book.view || 0}</Text>
                    </View>

                    <View className="recommend_warp" onClick={(e) => { e.stopPropagation(); navToComment(book._id!) }}>
                      <MyIcon name="dialogue" size={22} color="#999999" style={{fontWeight: 'bold'}} />
                      <Text className="comment">{book.comment || 0}</Text>
                    </View>
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
