import Taro, { Config, useEffect, useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtInput, AtList } from "taro-ui";
import "./index.scss";

export default function AccountDetail() {
  const _params: com.Account = this.$router.params;
  const [params, setParams] = useState(_params);
  const { title = '', username, password, ...other } = params;

  useEffect(() => {
    Taro.setNavigationBarTitle({ title });
  }, []);
  
  console.log(params);

  const keys = Object.keys(other);
  return (
    <View className="container">
      <AtList>
        <AtInput 
          name="title"
          title="标题"
          type='text'
          placeholder='请输入标题'
          value={title}
          onChange={(v: string) => {
            setParams({...params, title: v})
          }}
        />

        <AtInput
          name="acount"
          title="账号"
          type='text'
          placeholder='请输入账号'
          value={username}
          onChange={(v: string) => {
            setParams({ ...params, username: v })
          }}
        />

        <AtInput
          name="password"
          title="密码"
          type='text'
          placeholder='请输入账号'
          value={password}
          onChange={(v: string) => {
            setParams({ ...params, username: v })
          }}
        />

        {keys.map((item, index) => (
          <AtInput
            key={index}
            name="other"
            title={item}
            type='text'
            placeholder='请输入内容'
            value={params[item]}
            onChange={(v: string) => {
              setParams({ ...params, [item]: v })
            }}
          />
        ))}
      </AtList>
    </View>
  );
}

AccountDetail.config = {
  navigationBarTitleText: '常用'
} as Config;