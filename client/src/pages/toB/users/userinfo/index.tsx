import Taro, { Config, useState } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtList, AtListItem, AtActionSheet, AtActionSheetItem} from 'taro-ui'
import { useSelector, useDispatch } from '@tarojs/redux'
import { ToBUserinfo } from 'pages/toB/users/model'
import { userTypeDesc, userTypes } from 'pages/index/api'
import './index.scss'

const genders = {
  1: require('./images/man.png'),
  2: require('./images/woman.png')
}

function UserinfoEditor() {
  const {currentUser} = useSelector<any, ToBUserinfo>(state => state.toBUserinfo)
  const dispatch = useDispatch()
  const {avatarUrl, nickName, province, city, type = 3, gender = 1} = currentUser;
  const [visible, setVisible] = useState(false)

  const changeUserType = (item) => {
    Taro.showModal({
      title: '重要操作提示',
      content: `你确认要修改 ${nickName} 的用户类型为 ${item.desc} 吗？`,
      confirmText: '确认',
      cancelText: '取消',
      success: () => {
        dispatch({ type: 'toBUserinfo/updateUserInfo', payload: {type: item.value} })
        setVisible(false);
      },
    })
  }

  return (
    <View className="editor_container">
      <View className="base_info">
        <Image className="avatar" src={avatarUrl!} />
        <View className="name_wrap">
          <Image className="gender" src={genders[gender]} mode="aspectFit" />
          <Text className="nickname">{nickName}</Text>
        </View>
        
        <Text className="pc">{`${province} ${city}`}</Text>
      </View>

      <AtList>
        <AtListItem title="用户类型" arrow="right" extraText={userTypeDesc[type]} onClick={() => setVisible(true)} />
      </AtList>

      <AtActionSheet isOpened={visible} cancelText="取消" onCancel={() => setVisible(false)} onClose={() => setVisible(false)}>
        {userTypes.map((item) => (
          <AtActionSheetItem key={item.value} onClick={() => changeUserType(item)}>
            {item.desc}
          </AtActionSheetItem>
        ))}
      </AtActionSheet>
    </View>
  )
}

UserinfoEditor.config = {
  navigationBarTitleText: '用户信息'
} as Config

export default UserinfoEditor;