import Taro, {Config, useEffect, usePullDownRefresh} from "@tarojs/taro";
import {View, Image, Text, Button} from "@tarojs/components";
import { useSelector, useDispatch } from '@tarojs/redux';
import { BookState } from 'pages/Home/model';
import MyIcon from 'components/myIcon';
import "./index.scss";

export default function Articles() {
  const {subList} = useSelector<any, BookState>(state => state.book);
  const dispatch = useDispatch()

  useEffect(() => {
    Taro.getStorage({ key: 'userInfo' }).then(res => {
      dispatch({
        type: 'book/fetchSubList',
        payload: res.data._id
      })
    })
  }, []);

  usePullDownRefresh(() => {
    Taro.getStorage({ key: 'userInfo' }).then(res => {
      dispatch({
        type: 'book/fetchSubList',
        payload: res.data._id
      })
    })
  })

  function clickHandler(book: book.Item) {
    dispatch({
      type: 'book/info',
      payload: book
    })
    Taro.navigateTo({
      url: '/pages/toB/books/subpages/Editor/index'
    })
  }

  function addBookHandler() {
    dispatch({
      type: 'book/info',
      payload: 'reset'
    })
    Taro.navigateTo({ url: '/pages/toB/books/subpages/Editor/index' })
  }

  return (
    <View className="container">
      <Button className="add" onClick={addBookHandler}>新增书籍</Button>
      <View className="list_container">
        {subList.map((book) => (
          <View className="book_item" key={book._id} onClick={() => clickHandler(book)}>
            <View className="left">
              <Image src={book.cover!} className="cover" mode="aspectFill" />
            </View>
            <View className="content">
              <View className="name">{book.name}</View>
              <View className="author_wrap">
                <View className="author">{book.subscription!.author}</View>
                <View className="recommend_warp">
                  <MyIcon name="heart" size={18} color="#999999" />
                  <Text className="recommend">{book.recommend || 0}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

Articles.config = {
  navigationBarTitleText: "书籍管理",
  enablePullDownRefresh: true,
  navigationBarBackgroundColor: '#ededed',
  backgroundColor: '#ededed'
} as Config;
