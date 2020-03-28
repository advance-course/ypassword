import Taro, {Config, usePullDownRefresh, useReachBottom} from "@tarojs/taro";
import {View, Image, Text} from "@tarojs/components";
import usePagination from 'hooks/usePagination';
import { userListApi, userTypeDesc } from 'pages/index/api';
import "./index.scss";

export default function Users() {  
  const {list, loading, errMsg, setIncreasing, setLoading} = usePagination(userListApi, {current: 1});
  console.log(list);

  usePullDownRefresh(() => {
    setLoading(true);
  })

  useReachBottom(() => {
    setIncreasing(true);
  })

  return (
    <View className="container">
      {list.list.map((item) => (
        <View className="user_ctx" key={item._id} onClick={() => {}}>
          <Image className="avatar" src={item.avatarUrl!} />
          <View className="content_wrap">
            <Text className="nickname">{item.nickName}</Text>
            <Text className="user_type">{userTypeDesc[item.type]}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

Users.config = {
  navigationBarTitleText: "用户管理",
  navigationBarBackgroundColor: "#ffe100",
  navigationBarTextStyle: "black",
  enablePullDownRefresh: true,
} as Config;
