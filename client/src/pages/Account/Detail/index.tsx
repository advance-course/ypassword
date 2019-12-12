import Taro, { Config, useEffect } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtIcon, AtList, AtListItem, AtFab } from "taro-ui";
import "./index.scss";

export default function AccountDetail() {
  const {title, username, password, ...other}: com.Account = this.$router.params;
  const keys = Object.keys(other);
  return (
    <View className="container">
      <AtList>
        <AtListItem title="标题" extraText={title} />
        <AtListItem title="账号" extraText={username} />
        <AtListItem title="密码" extraText={password} />
        {keys.map((item, index) => (
          <AtListItem key={index} title={item} extraText={other[item]} />
        ))}
      </AtList>
      <View className="float_button">
        <AtFab size="normal">
          <Text className="at-icon at-icon-menu"></Text>
        </AtFab>
      </View>
    </View>
  );
}

AccountDetail.config = {
  navigationBarTitleText: '常用'
} as Config;