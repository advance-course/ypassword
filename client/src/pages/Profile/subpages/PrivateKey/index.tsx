import Taro, { useState } from '@tarojs/taro'
import {View, Textarea} from '@tarojs/components'
import {AtButton} from 'taro-ui'
import './index.scss'

export default function PrivateKey() {
  const [privateKey, setPrivateKey] = useState('');

  function sure() {
    const key = Taro.getStorageSync('rsa');
    key.privateKey = privateKey;
    Taro.setStorageSync('rsa', key);
    Taro.showToast({title: '私钥已保存至本地缓存', icon: "success"})
    Taro.navigateBack();
  }
  return (
    <View className="private_container">
      <View className="desc">私钥缺失，无法再解密您的账户信息，请您补全私钥</View>
      <Textarea className="key" placeholder="请补全" onInput={(e) => setPrivateKey(e.detail.value)} value={privateKey} maxlength={-1} />
      <AtButton className="btn" onClick={sure} type="primary">确认</AtButton>
    </View>
    
  )
}