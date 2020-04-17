import Taro, { Config, useEffect } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import qs from 'qs';
import { AtList, AtListItem, AtFab } from "taro-ui";
import "./index.scss";
import { useSelector } from '@tarojs/redux';
import { AccountState } from 'pages/Accounts/model';
import MyIcon from 'components/myIcon';

export default function AccountDetail() {
  const {curAccount} = useSelector<any, AccountState>(state => state.account);
  const { title = '', username, password, uuid: _uuid, category, ...other } = curAccount
  
  useEffect(() => {
    Taro.setNavigationBarTitle({ title }); 
  }, []);

  function copy(content: string) {
    Taro.setClipboardData({
      data: content,
      success: () => {
        Taro.showToast({ title: '成功复制到剪切板', icon: 'success' })
      }
    })
  } 

  const keys = Object.keys(other);
  return (
    <View className="container">
      <View className="category_wrap">
        <View className="left">
          <View className="img_wrap">
            {category && category.imgUrl
              ? <Image src={category.imgUrl} mode="aspectFill" className="img" />
              : <MyIcon name="RectangleCopy240" size={40} color="#88abee" />
            }
          </View>
          <Text className="name">{category && category.name ? category.name : '未选择分类'}</Text>
        </View>
      </View>
      <AtList className="item_wrap">
        <AtListItem title="标题" extraText={title} onClick={() => copy(title)} />
        <AtListItem title="账号" extraText={username} onClick={() => copy(username!)} />
        <AtListItem title="密码" extraText={password} onClick={() => copy(password!)} />
        {keys.map((item) => (
          <AtListItem key={item} title={item} extraText={other[item]} onClick={() => copy(other[item])} />
        ))}
      </AtList>
      <View className="float_button">
        <AtFab size="normal" onClick={() => Taro.navigateTo({ url: `/pages/Accounts/subpages/Editor/index?${qs.stringify(this.$router.params)}`})}>
          <Text className="at-icon at-icon-menu"></Text>
        </AtFab>
      </View>
    </View>
  );
}

AccountDetail.config = {
  navigationBarTitleText: ''
} as Config;