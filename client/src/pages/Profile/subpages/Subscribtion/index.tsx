import Taro, { Config, useEffect, useState } from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import { useSelector, useDispatch } from '@tarojs/redux'
import { SubscriptionState } from 'pages/Profile/subpages/Subscribtion/model'
import { Subscription } from 'pages/Profile/subpages/Subscribtion/api'
import { AtList, AtInput, AtButton } from 'taro-ui'
import './index.scss'

export default function Subscribtion() {
  const dispatch = useDispatch()
  const subscription = useSelector<any, SubscriptionState>(state => state.subscription)
  const {loading, info} = subscription;

  const [params, setParams] = useState<Subscription>({})

  useEffect(() => {
    Taro.getStorage({ key: 'userInfo' }).then(res => {
      if (!res.data.name) {
        setParams({...params, userid: res.data._id})
      }
      dispatch({
        type: 'subscription/fetchInfo',
        payload: res.data._id
      })
    })
  }, [])

  function save() {
    console.log(params)
    dispatch({
      type: 'subscription/add',
      payload: params
    })
  }
  
  if (loading) {
    return (
      <View className="loading_wrap">加载中...</View>
    )
  }

  if (info._id) {
    return (
      <View className="container">
        <View className="review">
          <View className="left">
            <Image className="logo" src={info.logo!} mode="aspectFill" />
          </View>
          <View className="right">
            <View className="name">{info.name}</View>
            <View className="author">{info.author}</View>
            <View className="desc">{info.desc}</View>
          </View>
        </View>
      </View>
      
    )
  }

  return (
    <View className="container">
      <View className="review">
        <View className="left">
          <Image className="logo" src={params.logo!} mode="aspectFill" />
        </View>
        <View className="right">
          <View className="name">{params.name}</View>
          <View className="author">{params.author}</View>
          <View className="desc">{params.desc}</View>
        </View>
      </View>
      <AtList>
        <AtInput
          onChange={(v: string) => { setParams({ ...params, name: v }) }}
          name="name"
          title="公众号名称"
          type='text'
          placeholder='请输入/粘贴标题'
          value={params.name}
        />

        <AtInput
          onChange={(v: string) => {
            setParams({ ...params, logo: v })
          }}
          name="url"
          title="LOGO"
          type='text'
          placeholder='请输入/粘贴Logo图片地址'
          value={params.logo}
        />

        <AtInput
          onChange={(v: string) => {
            setParams({ ...params, author: v })
          }}
          name="thumb"
          title="原创作者"
          type='text'
          placeholder='请输入原创作者名称'
          value={params.author}
        />

        <AtInput
          onChange={(v: string) => {
            setParams({ ...params, desc: v })
          }}
          name="author"
          title="公众号简介"
          type='text'
          placeholder='请输入'
          value={params.desc}
        />
      </AtList>

      <View className="btn_wrapper">
        <AtButton type="primary" className="add_btn" onClick={save}>确定</AtButton>
      </View>
    </View>
  )
}

Subscribtion.config = {
  navigationBarTitleText: '专属订阅号',
  navigationBarBackgroundColor: '#FFF'
} as Config