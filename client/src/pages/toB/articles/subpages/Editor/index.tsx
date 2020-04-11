import Taro, { Config, useEffect, useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtInput, AtList, AtButton, AtSwitch, AtListItem, AtActionSheet, AtActionSheetItem } from "taro-ui";
import "./index.scss";
import { useSelector, useDispatch } from '@tarojs/redux';
import { ArticleState } from 'pages/toB/articles/model';
import { SubscriptionState } from 'pages/Profile/subpages/Subscribtion/model';
import { BookState } from 'pages/Home/model';

export default function ArticleEditor() {
  const [visible, setVisible] = useState(false)
  const {info} = useSelector<any, ArticleState>(state => state.article)
  const { info: scb_info } = useSelector<any, SubscriptionState>(state => state.subscription)
  const {subList} = useSelector<any, BookState>(state => state.book)

  const dispatch = useDispatch()
  const {title, thumb, url, original, time, book = {} } = info;

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: title || '新增' });
  }, []);

  useEffect(() => {
    if (scb_info._id) {
      dispatch({
        type: 'article/info',
        payload: { subscription: scb_info }
      })
    } else {
      Taro.getStorage({ key: 'userInfo' }).then(res => {
        dispatch({
          type: 'subscription/fetchInfo',
          payload: res.data._id
        })
      })
    }
  }, [scb_info])

  useEffect(() => {
    if (subList.length == 0) {
      Taro.getStorage({ key: 'userInfo' }).then(res => {
        dispatch({
          type: 'book/fetchSubList',
          payload: res.data._id
        })
      })
    }
  }, []);

  function save() {
    if (!info.subscription || !info.subscription._id) {
      return Taro.showToast({
        title: '请先绑定专属订阅号'
      })
    }
    dispatch({
      type: 'article/add',
      payload: info
    });
  }

  function selectedBook(book: book.Item) {
    setVisible(false)
    dispatch({
      type: 'article/info',
      payload: {book}
    })
  }

  return (
    <View className="container">
      <AtList>
        <AtInput 
          onChange={(v: string) => { dispatch({ type: 'article/info', payload: { title: v }}) }} 
          name="title"
          title="文章标题"
          type='text' 
          placeholder='请输入/粘贴标题' 
          value={title} 
        />

        <AtInput
          onChange={(v: string) => {
            dispatch({ type: 'article/info', payload: { url: v } })
          }}
          name="url"
          title="文章地址"
          type='text'
          placeholder='请输入/粘贴文章地址'
          value={url}
        />

        <AtInput
          onChange={(v: string) => {
            dispatch({ type: 'article/info', payload: { thumb: v } })
          }}
          name="thumb"
          title="缩略图"
          type='text'
          placeholder='请粘贴缩略图地址'
          value={thumb}
        />

        <AtSwitch
          onChange={(v) => {
            dispatch({ type: 'article/info', payload: { original: v } })
          }}
          title='原创' 
          checked={original}
        />

        <AtInput
          onChange={(v: string) => {
            dispatch({ type: 'article/info', payload: { time: v } })
          }}
          name="time"
          title="发布时间"
          type='text'
          placeholder='请输入文章发布时间'
          value={time}
        />
        <AtListItem title='书籍归属' arrow='right' onClick={() => setVisible(true)} extraText={book.name} />
      </AtList>

      <View className="btn_wrapper">
        <AtButton type="primary" className="add_btn" onClick={save}>保存</AtButton>
      </View>

      <AtActionSheet 
        isOpened={visible} 
        cancelText='取消' 
        title='你的书籍' 
        onCancel={() => setVisible(false)} 
        onClose={() => setVisible(false)}
      >
        {subList.map(book => (
          <AtActionSheetItem onClick={() => selectedBook(book)} key={book._id}>
            {book.name}
          </AtActionSheetItem>
        ))}
      </AtActionSheet>
    </View>
  );
}

ArticleEditor.config = {
  navigationBarTitleText: '新增',
  navigationBarBackgroundColor: '#FFF'
} as Config;
