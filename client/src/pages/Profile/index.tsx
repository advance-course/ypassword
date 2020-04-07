import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Label, Image } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui';
import { UserInfo } from 'pages/index/api';
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
        <Image src={userInfo.avatarUrl!} className="avatar" />
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
        {/* <AtListItem
          title="不可变数据集案例"
          extraText=""
          arrow="right"
          onClick={() => Taro.navigateTo({ url: '/pages/Immutable/index' })}
        /> */}

        {/* <AtListItem
          title="Taro UI"
          extraText=""
          arrow="right"
          onClick={() => Taro.navigateTo({ url: '/pages/Taroui/index' })}
        /> */}
        
        <AtListItem
          title="图标库"
          extraText=""
          arrow="right"
          onClick={() => Taro.navigateTo({ url: '/pages/examples/icon/index' })}
        />

        {userInfo.type == 1 && (
          <AtListItem
            title="用户管理"
            extraText=""
            arrow="right"
            onClick={() => Taro.navigateTo({ url: '/pages/toB/users/index' })}
          />
        )}

        <AtListItem
          title="开发团队"
          extraText=""
          arrow="right"
          onClick={() => Taro.navigateTo({ url: '/pages/extra/devteam/index' })}
        />
        <AtListItem
          title="联系作者"
          extraText=""
          arrow="right"
          onClick={() => Taro.navigateTo({ url: '/pages/extra/author/index' })}
        />
      </AtList>
    </View>
  )
}

Profile.config = {
  "navigationBarTitleText": "设置"
}
