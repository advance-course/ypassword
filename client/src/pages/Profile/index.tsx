import Taro from '@tarojs/taro';
import { View, Label, Image } from '@tarojs/components';
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
    </View>
  )
}

Profile.config = {
  "navigationBarTitleText": "设置"
}