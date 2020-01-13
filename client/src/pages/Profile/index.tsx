import Taro, { useEffect, useState } from '@tarojs/taro';
import { View, Label, Image } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui';
import useUserInfo from 'hooks/useUserInfo';
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
        <AtListItem
          title="专属秘钥"
          extraText=""
          arrow="right"
          onClick={() => Taro.navigateTo({ url: '/pages/Profile/subpages/RSAKey/index' })}
        />
        <AtListItem 
          title="密码锁" 
          extraText="" 
          arrow="right"
          onClick={() => Taro.navigateTo({ url: '/pages/Settings/Lock/index' })}
        />
        <AtListItem
          title="不可变数据集案例"
          extraText=""
          arrow="right"
          onClick={() => Taro.navigateTo({ url: '/pages/Immutable/index' })}
        />

        <AtListItem
          title="Taro UI"
          extraText=""
          arrow="right"
          onClick={() => Taro.navigateTo({ url: '/pages/Taroui/index' })}
        />
        
        <AtListItem
          title="图标"
          extraText=""
          arrow="right"
          onClick={() => Taro.navigateTo({ url: '/pages/IconIndex/index' })}
        />
      </AtList>
    </View>
  )
}

Profile.config = {
  "navigationBarTitleText": "设置"
}
