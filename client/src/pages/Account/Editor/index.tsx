import Taro, { Config, useEffect, useState } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtInput, AtList, AtListItem, AtFab } from "taro-ui";
import "./index.scss";

const initParams = {
  title: "",
  username: "",
  password: ""
};

export default function AccountDetail() {
  const [params, setParams] = useState<com.Account>(this.$router.params || initParams);
  const {title, username, password, ...other} = params;
  
  return (
    <View className="container">
      <AtList>
        <AtInput
          name="title"
          title="标题"
          type="text"
          placeholder="请输入当前账号的标题"
          value={this.state.value1}
          onChange={this.handleChange.bind(this)}
        />
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