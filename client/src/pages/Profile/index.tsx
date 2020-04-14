import Taro from '@tarojs/taro';
import { View, Label, Image, Block, OfficialAccount, Button } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui';
import './index.scss';
import { useSelector } from '@tarojs/redux';
import { GlobalState } from 'store/global';

export default function Profile() {
  const {userInfo} = useSelector<any, GlobalState>(state => state.global)

  return (
    <View className="profile_container">
      {userInfo._id ? (
        <View className="userInfoContainer">
          <Image src={userInfo.avatarUrl!} className="avatar" />
          <Label className="username">{userInfo.nickName}</Label>
          <Label className="city">{userInfo.city}</Label>
        </View>
      ) : (
        <View className="userInfoContainer">
          <View className="tip">您还未授权，部分功能无法正常使用</View>
          <Button type="primary" className="btn" onClick={() => Taro.navigateTo({url: '/pages/Auth/index'})}>点击授权</Button>
        </View>
      )}
      

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
        
        {/* <AtListItem
          title="图标库"
          extraText=""
          arrow="right"
          onClick={() => Taro.navigateTo({ url: '/pages/examples/icon/index' })}
        /> */}

        {userInfo.type == 1 && (
          <Block>
            <AtListItem
              title="用户管理"
              extraText=""
              arrow="right"
              onClick={() => Taro.navigateTo({ url: '/pages/toB/users/index' })}
            />
          </Block>
        )}

        {[1, 2, 5].includes(userInfo.type!) && (
          <Block>
            <AtListItem
              title="专属订阅号"
              extraText=""
              arrow="right"
              onClick={() => Taro.navigateTo({ url: '/pages/Profile/subpages/Subscribtion/index' })}
            />

            <AtListItem
              title="书籍管理"
              extraText=""
              arrow="right"
              onClick={() => Taro.navigateTo({ url: '/pages/toB/books/index' })}
            />

            <AtListItem
              title="文章管理"
              extraText=""
              arrow="right"
              onClick={() => Taro.navigateTo({ url: '/pages/toB/articles/index' })}
            />
          </Block>
        )}

        {/* <AtListItem
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
        /> */}
      </AtList>
      <View style={{height: '15Px'}} />
      <OfficialAccount />
    </View>
  )
}

Profile.config = {
  "navigationBarTitleText": "设置"
}
