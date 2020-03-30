import Taro, {Config, usePullDownRefresh, useReachBottom} from "@tarojs/taro";
import {View, Image, Text} from "@tarojs/components";
import PaginationProvider from 'components/PaginationProvider'
import usePagination from 'hooks/usePagination';
import { userListApi, userTypeDesc } from 'pages/index/api';
import "./index.scss";

export default function Users() {  
  const {list, loading, errMsg, setIncreasing, setLoading, increasing} = usePagination(userListApi, {current: 1, pageSize: 20});

  usePullDownRefresh(() => {
    setLoading(true);
  })

  useReachBottom(() => {
    console.log('reachBottom:', list.pagination.lastPage)
    if (!list.pagination.lastPage) {
      setIncreasing(true);
    }
  })

  return (
    <PaginationProvider className="container" loading={loading} errMsg={errMsg} lastPage={list.pagination.lastPage} increasing={increasing}>
      {list.list.map((item) => (
        <View className="user_ctx" key={item._id} onClick={() => {}}>
          <Image className="avatar" src={item.avatarUrl!} />
          <View className="content_wrap">
            <Text className="nickname">{item.nickName}</Text>
            <Text className="user_type">{userTypeDesc[item.type]}</Text>
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
