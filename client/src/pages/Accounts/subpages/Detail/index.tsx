import Taro, { Config, useEffect } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import qs from 'qs';
import { AtList, AtListItem, AtFab, AtButton } from "taro-ui";
import "./index.scss";
import { useSelector, useDispatch } from '@tarojs/redux';
import { AccountState } from 'pages/Accounts/model';
import MyIcon from 'components/myIcon';
import { GlobalState } from 'store/global';

export default function AccountDetail() {
  const {curAccount} = useSelector<any, AccountState>(state => state.account);
  const {decrypt} = useSelector<any, GlobalState>(state => state.global)
  const { title = '', username, password, uuid: _uuid, category, userid, ...other } = curAccount
  const dispatch = useDispatch()
  
  useEffect(() => {
    Taro.setNavigationBarTitle({ title }); 
  }, []);

  function copy(content: string) {
    Taro.setClipboardData({
      data: content,
      success: () => {
        Taro.showToast({ title: '已复制', icon: 'success' })
      }
    })
  } 

  function removeAccount() {
    Taro.showModal({
      title: '警告',
      content: '你确定要删除该账号吗',
      confirmText: '确定',
      success: (res) => {
        if (res.confirm) {
          dispatch({
            type: 'account/removeAccount',
            payload: curAccount
          })
        }
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
        <AtListItem title="账号" extraText={username ? decrypt.decrypt(username) : ''} onClick={() => copy(decrypt.decrypt(username!) || '')} />
        <AtListItem title="密码" extraText={password ? decrypt.decrypt(password) : ''} onClick={() => copy(decrypt.decrypt(password!) || '')} />
        {keys.map((item) => (
          <AtListItem key={item} 
            title={item} 
            extraText={decrypt.decrypt(other[item]) || ''}
            onClick={() => copy(decrypt.decrypt(other[item]) || '')}
          />
        ))}
      </AtList>
      <View className="btn_wrapper">
        <AtButton className="add_btn" type="secondary" onClick={removeAccount}>删除账号</AtButton>
      </View>
      
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