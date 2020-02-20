import Taro, { Config, useEffect } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import qs from 'qs';
import { AtIcon, AtList, AtListItem, AtFab } from "taro-ui";
import "./index.scss";

export default function AccountDetail() {
  const {title = '', username, password, ...other}: com.Account = this.$router.params;
  useEffect(() => {
    Taro.setNavigationBarTitle({ title });  
  }, []);
  
  const keys = Object.keys(other);
  return (
    <View className="container">
      <AtList>
        <AtListItem title="标题" extraText={title} />
        <AtListItem title="账号" extraText={username} />
        <AtListItem title="密码" extraText={password} />
        {keys.map((item) => (
          <AtListItem key={item} title={item} extraText={other[item]} />
        ))}
      </AtList>
      <View className="float_button">
        <AtFab size="normal" onClick={() => Taro.navigateTo({ url: `/pages/Account/Editor/index?${qs.stringify(this.$router.params)}`})}>
          <Text className="at-icon at-icon-menu"></Text>
        </AtFab>
      </View>
    </View>
  );
}

AccountDetail.config = {
  navigationBarTitleText: '常用'
} as Config;