import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui';
import useUserInfo from 'hooks/useUserInfo';

export default function UserInfo() {
  const { nickName = '', avatarUrl = '', country = '', province = '', gender = 1, city = '' } = useUserInfo();

  return (
    <View>
      <AtList>
        <AtListItem title="" extraText={nickName} thumb={avatarUrl} />
        <AtListItem title="国家" extraText={`${country}`} />
        <AtListItem title="省份" extraText={`${province}`} />
        <AtListItem title="城市" extraText={`${city}`} />
        <AtListItem title="性别" extraText={gender == 1 ? '男' : '女'} />
      </AtList>
    </View>
  )
}

UserInfo.config = {
  "navigationBarTitleText": "个人信息"
}