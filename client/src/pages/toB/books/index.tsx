import Taro, {Config, useEffect, usePullDownRefresh} from "@tarojs/taro";
import {View, Button} from "@tarojs/components";
import { useSelector, useDispatch } from '@tarojs/redux';
import { BookState } from 'pages/Home/model';
import BookItem from './components/BookItem'
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
          <BookItem info={book} key={book._id} />
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
