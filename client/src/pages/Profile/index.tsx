import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Label, Image } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui';
import { UserInfo } from 'pages/Auth/interface';

import './index.scss';

export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
  useEffect(() => {
    Taro.getStorage({ key: 'userInfo' }).then(res => {
      setUserInfo(res.data);
    })
  }, [userInfo]);

  return (
    <View className="profile_container">
      <View className="userInfoContainer">
        <Image src={userInfo.avatarUrl} className="avatar" />
        <Label className="username">{userInfo.nickName}</Label>
        <Label className="city">{userInfo.city}</Label>
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
          onClick={() => Taro.navigateTo({ url: '/pages/examples/icon/index' })}
        />
      </AtList>
    </View>
  )
}

Profile.config = {
  "navigationBarTitleText": "设置"
}
