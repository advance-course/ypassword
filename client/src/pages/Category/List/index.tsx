import Taro, { useState, useEffect } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { queryCategoryListApi } from '../api'
import { UserInfo } from 'pages/Auth/interface';

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

  function edit () {

  }

  return (
    <View className="container">
    {list.map((item) => (
        <View key={item._id} className="item" onClick={() => {edit}}>
          <Image src={item.imgUrl} size={40} />
          <Text className="title">{item.name}</Text>
        </View>
      )
    )}
    </View>
  )
}
