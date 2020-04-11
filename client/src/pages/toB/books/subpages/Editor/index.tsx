import Taro, { Config, useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtInput, AtList, AtButton } from "taro-ui";
import "./index.scss";
import { useSelector, useDispatch } from '@tarojs/redux';
import { BookState } from 'pages/Home/model';
import { SubscriptionState } from 'pages/Profile/subpages/Subscribtion/model';

export default function ArticleEditor() {
  const {bookInfo} = useSelector<any, BookState>(state => state.book);
  const {info} = useSelector<any, SubscriptionState>(state => state.subscription)
  const dispatch = useDispatch()
  
  const {cover, introduction, name, reward_code} = bookInfo;

  useEffect(() => {
    Taro.getStorage({ key: 'userInfo' }).then(res => {
      dispatch({
        type: 'book/info',
        payload: {userid: res.data._id}
      })
    })
    if (bookInfo._id) {
      Taro.setNavigationBarTitle({title: bookInfo.name!})
    }
  }, []);

  useEffect(() => {
    if (info._id) {
      dispatch({
        type: 'book/info',
        payload: { subscription: info }
      })
    } else {
      Taro.getStorage({ key: 'userInfo' }).then(res => {
        dispatch({
          type: 'subscription/fetchInfo',
          payload: res.data._id
        })
      })
    }
  }, [info])

  function save() {
    if (!bookInfo.subscription || !bookInfo.subscription._id) {
      return Taro.showToast({
        title: '请先配置您的订阅号'
      })
    }
    if (!bookInfo._id) {
      return dispatch({
        type: 'book/add',
        payload: bookInfo
      });
    }
    dispatch({
      type: 'book/update',
      payload: bookInfo
    });
  }

  return (
    <View className="container">
      <AtList>
        <AtInput 
          onChange={(v: string) => { dispatch({type: 'book/info', payload: {name: v}}) }} 
          name="title"
          title="书名"
          type='text' 
          placeholder='请输入' 
          value={name} 
        />

        <AtInput
          onChange={(v: string) => {
            dispatch({ type: 'book/info', payload: { cover: v } })
          }}
          name="cover"
          title="封面地址"
          type='text'
          placeholder='粘贴公众号图片库中地址'
          value={cover}
        />

        <AtInput
          onChange={(v: string) => {
            dispatch({ type: 'book/info', payload: { introduction: v } })
          }}
          name="introduction"
          title="简介"
          type='text'
          placeholder='请输入简介'
          value={introduction}
        />

        <AtInput
          onChange={(v: string) => {
            dispatch({ type: 'book/info', payload: { reward_code: v } })
          }}
          name="reward_code"
          title="赞赏码图片URL地址"
          type='text'
          placeholder='推荐使用给赞'
          value={reward_code}
        />
      </AtList>

      <View className="btn_wrapper">
        <AtButton type="primary" className="add_btn" onClick={save}>保存</AtButton>
      </View>
    </View>
  );
}

ArticleEditor.config = {
  navigationBarTitleText: '新增',
  navigationBarBackgroundColor: '#FFF'
} as Config;
