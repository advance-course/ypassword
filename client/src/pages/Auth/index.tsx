import Taro from '@tarojs/taro';
import { View, Image, Label } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import { CommonEventFunction } from '@tarojs/components/types/common';

import topImage from './images/inspection.png';
import './index.scss';
import { registerApi } from 'pages/index/api';

export default function Auth() {
  const getUserInfo: CommonEventFunction<any> = (res) => {
    let result = res.detail
    if (result && result.userInfo) {
      Taro.showLoading({title: '注册中...'});
      registerApi(result.userInfo).then(() => {
        Taro.navigateBack();
        Taro.hideLoading();
        Taro.showToast({title: '注册成功', duration: 1000 })
      })
    }
  }

  return (
    <View className="container">

      <View className="titleView">
        <Image src={topImage} className="image" />
        <Label className="title">授权应用获取以下信息</Label>
      </View>

      <View className="tipView"><Label className="tip">您的微信头像</Label></View>
      <View className="tipView"><Label className="tip">您的微信昵称</Label></View>
      <View className="tipView"><Label className="tip">其他基本信息</Label></View>

      <View className="btnView">
        <AtButton
          customStyle={{ marginTop: '60Px', backgroundColor: '#4991FF' }}
          type="primary"
          openType="getUserInfo"
          onGetUserInfo={getUserInfo}
        >微信信息授权
      </AtButton>
      </View>
      
      
    </View>
  )
}

Auth.config = {
  "navigationBarTitleText": "授权"
}