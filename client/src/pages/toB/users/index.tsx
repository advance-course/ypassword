import Taro, {Config, usePullDownRefresh, useReachBottom} from "@tarojs/taro";
import {View, Image, Text} from "@tarojs/components";
import PaginationProvider from 'components/PaginationProvider'
import { AtSearchBar } from 'taro-ui'
import { useDispatch } from '@tarojs/redux';
import usePagination from 'hooks/usePagination';
import { userListApi, userTypeDesc, UserInfo } from 'pages/index/api';
import _ from 'lodash'
import "./index.scss";

const tagStyle = {
  1: 'supermana',
  2: 'mana',
  3: 'normal',
  4: 'vip'
}

export default function Users() {  
  const {list, loading, errMsg, setIncreasing, setLoading, increasing, setParams} = usePagination(userListApi, {current: 1, pageSize: 20});
  const dispatch = useDispatch()

  usePullDownRefresh(() => {
    setLoading(true);
  })

  useReachBottom(() => {
    if (!list.pagination.lastPage) {
      setIncreasing(true);
    }
  })

  const searchHandler = _.debounce((value: string) => {
    setParams({keyword: value}, true);
  }, 600)

  const navgate = (userinfo: UserInfo) => {
    dispatch({ type: 'toBUserinfo/setUserInfo', payload: userinfo });
    Taro.navigateTo({url: '/pages/toB/users/userinfo/index'})
  }

  return (
    <PaginationProvider className="container" loading={loading} errMsg={errMsg} lastPage={list.pagination.lastPage} increasing={increasing}>
      <AtSearchBar value="" onChange={searchHandler} placeholder="输入名称或者id搜索用户" />
      {list.list.map((item) => (
        <View className="user_ctx" key={item._id} onClick={() => navgate(item)}>
          <Image className="avatar" src={item.avatarUrl!} />
          <View className="content_wrap">
            <Text className={`nickname ${tagStyle[item.type]}`}>{item.nickName}</Text>
            <Text className={`user_type ${tagStyle[item.type]}`}>{userTypeDesc[item.type]}</Text>
          </View>
        </View>
      ))}
    </PaginationProvider>
  );
}

Users.config = {
  navigationBarTitleText: "用户管理",
  navigationBarBackgroundColor: "#ffe100",
  navigationBarTextStyle: "black",
  enablePullDownRefresh: true,
} as Config;
