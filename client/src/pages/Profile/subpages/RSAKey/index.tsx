import Taro, { Config, useState, useEffect, useDidShow } from '@tarojs/taro';
import {View, Text, Block, Input, Button} from '@tarojs/components';
import {AtButton} from 'taro-ui';
import JSEncrypt from 'utils/rsa';
import { UserInfo, userUpdateApi } from 'pages/index/api';
import { useSelector } from '@tarojs/redux';
import { GlobalState } from 'store/global';
import './index.scss'

export interface Key {
  publicKey?: string,
  privateKey?: string
}

export default function RSAKeys() {
  const {crypt} = useSelector<any, GlobalState>(state => state.global)
  const [key, setKey] = useState<Key>({});
  const [createDisabled, setCreateDisabled] = useState(false);
  const [text, setText] = useState('');
  const [miText, setMitext] = useState('');
  const [deText, setDetext] = useState('')

  useEffect(() => {
    // 暂时未处理如果本地缓存的key呗清除的情况
    const res = Taro.getStorageSync('rsa');
    if (res) {
      setKey(res);
      console.log(res);
      setCreateDisabled(true)
      if (res.publicKey && res.privateKey) {
        crypt.setPublicKey(res.publicKey)
        crypt.setPrivateKey(res.privateKey)
      }
    }
  }, [])

  useDidShow(() => {
    const res = Taro.getStorageSync('rsa');
    if (res.publicKey && !res.privateKey) {
      Taro.navigateTo({url: '/pages/Profile/subpages/PrivateKey/index'})
    } else {
      setKey(res);
    }
  })

  function createKeys() {
    if (createDisabled) {
      return;
    }

    const res = Taro.getStorageSync('userInfo');
    
    if (!res || !res.data) {
      Taro.navigateTo({ url: '/pages/Auth/index' })
      return;
    }
    
    Taro.showLoading({title: '生成中...'});
    const _crypt = new JSEncrypt({ default_key_size: 1024 });
    _crypt.getKey(() => {
      Taro.hideLoading();
      const rsa = {
        publicKey: crypt.getPublicKey(),
        privateKey: crypt.getPrivateKey()
      }
      setKey(rsa)
      crypt.setPublicKey(rsa.publicKey)
      crypt.setPrivateKey(rsa.privateKey)
      Taro.setStorage({ key: 'rsa', data: rsa })
      const userinfo: UserInfo = Taro.getStorageSync('userInfo')
      if (userinfo._id) {
        userinfo.publicKey = rsa.publicKey;
        Taro.setStorage({key: 'userInfo', data: userinfo});
        userUpdateApi(userinfo._id, { publicKey: rsa.publicKey });
      }
    });
  }

  function encryption() {
    setMitext(crypt.encrypt(text));
  }

  function decryption() {
    setDetext(crypt.decrypt(miText));
  }

  function copy(content: string) {
    Taro.setClipboardData({
      data: content,
      success: () => {
        Taro.showToast({title: '成功复制到剪切板', icon: 'success'})
      }
    })
  }

  function save() {
    Taro.showModal({
      title: '重要操作提示',
      content: '在将私钥交由我给您保管之前，您需要对我完全信任。我们不会用您的私钥做任何操作，请您完全放心',
      confirmText: '我想好了',
      success: (res) => {
        if (res.confirm) {
          const userinfo: UserInfo = Taro.getStorageSync('userInfo')
          if (userinfo._id) {
            userUpdateApi(userinfo._id, { privateKey: key.privateKey }).then(res => {
              Taro.showToast({ title: '存储成功！', icon: 'success' })
            });
          }
        }
      }
    })
  }

  return (
    <View className="rsa_container">
      <View className="text_wrap"><Text className="introduce">「码易」使用RSA加密保护您的账号。</Text></View>
      <View className="text_wrap"><Text className="introduce">RSA 加密是一种非对称加密技术。用户可以在该页面生一对秘钥，分别为公钥跟私钥，私钥由用户自己保存，公钥存储在天谴之月数据库中。您的账户信息最终由公钥私钥共同加密，当您生成专属公钥秘钥之后，可以在下方尝试观察加密之后的数据。为了您的安全考虑，我们会将您的数据加密之后，存储在数据库中，也就意味着，即使是开发者，也只能看到您加密之后的数据。私钥我们会帮您存储在本地缓存之中，如果您删除「天谴之月」小程序，您的私钥就会遗失，那么您的信息就再也没有人能够解密，因此为了防止意外情况，请一定要保存好您的私钥，它是读取您数据信息的唯一凭证。</Text></View>
      
      <AtButton className="create" type="primary" onClick={createKeys} disabled={createDisabled}>生成专属公钥私钥对</AtButton>
      
      {key.publicKey && (
        <Block>
          <View className="title">您的专属公钥</View>
          <View className="key">{key.publicKey || ""}</View>
        </Block>
      )}

      {key.privateKey && (
        <Block>
          <View className="title">您的专属私钥</View>
          <View className="warn">私钥请您务必妥善保管，它是解密您加密数据的唯一凭证，遗失后您的数据将无人能够读取</View>
          <View className="key">{key.privateKey || ''}</View>
          <View className="btn_group">
            <Button className="btn" onClick={() => copy(key.privateKey || '')}>点击复制私钥</Button>
            <Button className="btn" onClick={save}>我帮您保存</Button>
          </View>
        </Block>
      )}
      
      {key.privateKey && key.publicKey && (
        <Block>
          <View className="title lock">加密处理体验</View>
          <View className="lock_info">
            <Input className="input" name="" onInput={(e) => setText(e.detail.value)} value={text} placeholder="输入您想要加密的内容" />
            <Button className="btn" type="primary" onClick={encryption}>加密</Button>
          </View>

          <View className="key mitext" onClick={() => copy(miText || '')} >
            {miText || '这里将会暂时加密之后的数据'}
          </View>

          <View className="lock_info">
            <Input className="input" name="" placeholder="解密结果展示" value={deText} />
            <Button className="btn" type="primary" onClick={decryption}>解密</Button>
          </View>
        </Block>
      )}
      
    </View>
  );
}

RSAKeys.config  = {
  navigationBarTitleText: '生成专属公钥秘钥'
} as Config
