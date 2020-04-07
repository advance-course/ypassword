import Taro, { useEffect } from '@tarojs/taro';
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

  return (
    <View className="container">
      {list.list.length ? (
        <Swiper className="content">
          {list.list.map((book) => (
            <SwiperItem className="book" key={book._id}>
              <View className="inner_wrap">
                <View className="top">
                  <Image className="cover" src={book.cover!} mode="aspectFill" />
                  <View className="name">{book.name}</View>
                </View>
                
                <View className="bottom">
                  <Image className="author_avatar" src={book.author_avatar!} mode="aspectFill" />
                  <View className="author">{book.author}</View>
                  <View className="recommend_warp">
                    <MyIcon name="heart" size={30} color="#999" />
                    <Text className="recommend">{book.recommend}</Text>
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
