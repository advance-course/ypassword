import Taro, { Config, useEffect, useState } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { AtInput, AtList, AtButton, AtFloatLayout, AtIcon } from "taro-ui";
import "./index.scss";
import { useSelector, useDispatch } from '@tarojs/redux';
import { AccountState } from 'pages/Accounts/model';
import { createUUID } from 'utils';
import { GlobalState } from 'store/global';
import MyIcon from 'components/myIcon';
import { CategoryState } from 'pages/Category/model';

const defProps = {
  key: '',
  value: ''
}

export default function AccountDetail() {
  const {curAccount} = useSelector<any, AccountState>(state => state.account);
  const {encrypt, userId, decrypt} = useSelector<any, GlobalState>(state => state.global)
  const {selected} = useSelector<any, CategoryState>(state => state.category)
  const dispatch = useDispatch()
  const { uuid, title = '', username, password, category, userid: _userid, ...other } = curAccount;

  const [visible, setVisible] = useState(false);
  const [properties, setProperties] = useState(defProps);

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: title || '新增' });

    dispatch({
      type: 'category/selected',
      payload: 'reset'
    })
  }, []);

  useEffect(() => {
    if (selected && selected._id) {
      dispatch({
        type: 'account/accountInfo',
        payload: { category: selected }
      })
    }
  }, [selected])

  function addPropertiesHandler() {
    dispatch({
      type: 'account/accountInfo',
      paylaod: {
        [properties.key]: properties.value
      }
    })
    setProperties(defProps);
    setVisible(false);
  }

  function save() {
    if (!username || !title) {
      return Taro.showToast({
        title: '请至少填写标题和账号信息',
        icon: "none"
      })
    }
    if (!curAccount.uuid) {
      curAccount.uuid = createUUID();
    }
    curAccount.userid = userId

    dispatch({
      type: 'account/addAccount',
      payload: curAccount
    });
  }

  function categorySelector() {
    Taro.navigateTo({ url: `/pages/Category/List/index?select=true&type=1` })
  }

  const keys = Object.keys(other);
  return (
    <View className="container">
      <View className="category_wrap" onClick={categorySelector}>
        <View className="left">
          <View className="img_wrap">
            {category && category.imgUrl
              ? <Image src={category.imgUrl} mode="aspectFill" className="img" />
              : <MyIcon name="RectangleCopy240" size={40} color="#88abee" />
            }
          </View>
          <Text className="name">{category && category.name ? category.name : '未选择分类'}</Text>
        </View>
        
        <AtIcon className="right" value='chevron-right' size='18' color='#999' />
      </View>
      <AtList className="item_wrap">
        <AtInput
          onChange={(v: string) => { dispatch({type: 'account/accountInfo', payload: {title: v}}) }}
          name="title"
          title="标题"
          type='text'
          placeholder='请输入标题'
          value={title}
        />

        <AtInput
          onChange={(v: string) => { dispatch({type: 'account/accountInfo', payload: { username: encrypt.encrypt(v) }}) }}
          name="acount"
          title="账号"
          type='text'
          placeholder='请输入账号'
          value={username ? decrypt.decrypt(username!) : ''}
        />

        <AtInput
          onChange={(v: string) => { dispatch({ type: 'account/accountInfo', payload: { password: encrypt.encrypt(v) } }) }}
          name="password"
          title="密码"
          type='text'
          placeholder='请输入账号'
          value={password ? decrypt.decrypt(password!) : ''}
        />

        {keys.map((item) => (
          <AtInput
            onChange={(v: string) => { dispatch({type: 'account/accountInfo', payload: {[item]: encrypt.encrypt(v) }}) }}
            key={item}
            name="other"
            title={item}
            type='text'
            placeholder='请输入内容'
            value={curAccount[item] ? decrypt.decrypt(curAccount[item]) : ''}
          />
        ))}
      </AtList>

      <View className="btn_wrapper">
        <AtButton type="primary" className="add_btn" onClick={save}>保存修改</AtButton>
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