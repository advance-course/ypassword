import Taro, { useState, useEffect, navigateTo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { queryCategoryListApi, delCategoryApi } from '../Edit/api'
import { UserInfo } from 'pages/Auth/interface';
import './index.scss'
import { AtButton } from 'taro-ui';

export default function List () {

  const [list, setList] = useState([])

  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo)

  useEffect(() => {
    Taro.getStorage({ key: 'userInfo' }).then(res => {
      setUserInfo(res.data)
    })
  }, [])

  useEffect(() => {
    fetchList()
  }, [])

  function fetchList () {
    return queryCategoryListApi({
      userID: userInfo._id
    }).then(res => {
      setList(res.data.data)
    })
  }

  function handleDel (item) {
    delCategoryApi({
      userID: userInfo._id,
      _id: item._id
    }).then(res => {
      if (res.success) {
        Taro.showToast({title: '删除成功', duration: 1000 })
      }
    })
  }

  // onClick={() => navigateTo({ url: './Edit/index' })}
  return (
    <View className="container">
    <AtButton className="btn-add" type='secondary' onClick={() => navigateTo({ url: '/pages/Category/Edit/index' })}>添加分类</AtButton>
    {list.map((item) => (
        <View key={item._id} className="item">
          <Image src={item.imgUrl} className="img" />
          <Text className="name">{item.name}</Text>
          <AtButton type='secondary' size='small'>编辑</AtButton>
          <AtButton type='secondary' size='small' onClick={() => handleDel(item)}>删除</AtButton>
        </View>
      )
    )}
    </View>
  )
}
