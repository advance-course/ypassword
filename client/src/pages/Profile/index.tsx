import Taro from '@tarojs/taro';
import { View, Label, Image } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui';
import useUserInfo from 'src/hooks/useUserInfo';
import './index.scss';

export default function Profile() {
  const { nickName = '', avatarUrl = '', city = '' } = useUserInfo();

  return (
    <View>
      <View className="userInfoContainer" onClick={() => Taro.navigateTo({ url: '../UserInfo/index' })}>
        <Image src={avatarUrl} className="avatar" />
        <Label className="username">{nickName}</Label>
        <Label className="city">{city}</Label>
      </View>
      
      <AtList>
        <AtListItem title="类型设置" extraText="x" arrow="right" />
      </AtList>
    </View>
  )
}

Profile.config = {
  "navigationBarTitleText": "设置"
}