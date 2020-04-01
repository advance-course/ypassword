import Taro, { Config, useEffect, useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtInput, AtList, AtButton, AtFloatLayout } from "taro-ui";
import "./index.scss";

const defProps = {
  key: '',
  value: ''
}

export default function AccountDetail() {
  const _params: com.Account = this.$router.params;
  const [params, setParams] = useState(_params);
  const { title = '', username, password, ...other } = params;

  const [visible, setVisible] = useState(false);
  const [properties, setProperties] = useState(defProps);

  useEffect(() => {
    Taro.setNavigationBarTitle({ title });
  }, []);

  function addPropertiesHandler() {
    setParams({
      ...params,
      [properties.key]: properties.value
    })
    setProperties(defProps);
    setVisible(false);
  }

  // console.log(params);

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

        {keys.map((item) => (
          <AtInput
            key={item}
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

      <View className="btn_wrapper">
        <AtButton type="primary" className="add_btn">保存修改</AtButton>
        <AtButton className="add_btn" onClick={() => setVisible(true)}>新增字段</AtButton>
      </View>


      <AtFloatLayout
        isOpened={visible}
        title="新增字段"
        onClose={() => setVisible(false)}
      >
        <AtInput
          name="title"
          title="属性名"
          type='text'
          placeholder='请输入新增属性名'
          value={properties.key}
          onChange={(v: string) => {
            setProperties({ ...properties, key: v })
          }}
        />
        <AtInput
          name="title"
          title="属性值"
          type='text'
          placeholder='请输入新增属性值'
          value={properties.value}
          onChange={(v: string) => {
            setProperties({ ...properties, value: v })
          }}
        />
        <AtButton type="primary" className="add_btn" onClick={addPropertiesHandler}>
          确认
        </AtButton>
      </AtFloatLayout>
    </View>
  );
}

AccountDetail.config = {
  navigationBarTitleText: '常用'
} as Config;
