import Taro, { Config, useState } from '@tarojs/taro';
import {View} from '@tarojs/components';
import {AtButton, AtInput} from 'taro-ui';
import JSEncrypt from 'utils/rsa';

export interface Key {
  publickKey?: string,
  privateKey?: string
}

export default function RSAKeys() {
  const [key, setKey] = useState<Key>({});
  const [text, setText] = useState('');
  const [miText, setMitext] = useState('');
  const [deText, setDetext] = useState('')

  function createKeys() {
    Taro.showLoading({title: '生成中...'});
    const crypt = new JSEncrypt({ default_key_size: 1024 });
    crypt.getKey(() => {
      Taro.hideLoading();
      setKey({
        publickKey: crypt.getPublicKey(),
        privateKey: crypt.getPrivateKey()
      })
    });
  }

  function encryption() {
    const crypt = new JSEncrypt();
    crypt.setPublicKey(key.publickKey);
    crypt.setPrivateKey(key.privateKey);
    setMitext(crypt.encrypt(text));
  }

  function decryption() {
    const crypt = new JSEncrypt();
    crypt.setPublicKey(key.publickKey);
    crypt.setPrivateKey(key.privateKey);
    setDetext(crypt.decrypt(miText));
  }

  return (
    <View>
      <View>公钥</View>
      <View>{key.publickKey || ""}</View>

      <View>私钥</View>
      <View>{key.privateKey || ''}</View>
      <AtButton type="primary" onClick={createKeys}>生成专属公钥私钥对</AtButton>
      <AtInput name="" onChange={(v: string) => setText(v)} value={text} />
      <AtButton type="primary" onClick={encryption}>加密</AtButton>
      
      <View>{miText}</View>

      <AtButton type="primary" onClick={decryption}>解密</AtButton>
      <View>{deText}</View>
    </View>
  );
}

RSAKeys.config  = {
  navigationBarTitleText: '生成专属公钥秘钥'
} as Config
