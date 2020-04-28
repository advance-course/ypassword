import Taro, { useState } from '@tarojs/taro'
import {View, Textarea} from '@tarojs/components'
import {AtButton} from 'taro-ui'
import './index.scss'
import { useSelector, useDispatch } from '@tarojs/redux';
import { GlobalState } from 'store/global';

export default function PrivateKey() {
  const [privateKey, setPrivateKey] = useState('');
  const { encrypt, decrypt } = useSelector<any, GlobalState>(state => state.global)
  const dispatch = useDispatch()

  function sure() {
    decrypt.setPrivateKey(privateKey)
    const en = encrypt.encrypt('hello')
    const de = decrypt.decrypt(en)

    const key = Taro.getStorageSync('rsa');
    key.privateKey = privateKey;
    
    if (de) {
      dispatch({type: 'global/userInfo', payload: {
        privateKey
      }})
      Taro.setStorageSync('rsa', key);
      Taro.showToast({ title: '私钥已保存至本地缓存', icon: "success" })
      Taro.navigateBack();  
    }

    if (!de) {
      Taro.showToast({ title: '私钥错误，无法解密您的信息', icon: 'none' })
    }
  }
  return (
    <View className="private_container">
      <View className="desc">私钥缺失或者错误，无法再解密您的账户信息，请您补全私钥</View>
      <Textarea className="key" placeholder="请补全" onInput={(e) => setPrivateKey(e.detail.value)} value={privateKey} maxlength={-1} />
      <AtButton className="btn" onClick={sure} type="primary">确认</AtButton>
    </View>
  )
}