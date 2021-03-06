import Taro, { Config, useState, useEffect } from '@tarojs/taro';
import {View, Text, Block, Input, Button} from '@tarojs/components';
import {AtButton} from 'taro-ui';
import { UserInfo, userUpdateApi } from 'pages/index/api';
import { useSelector, useDispatch } from '@tarojs/redux';
import { GlobalState } from 'store/global';
import './index.scss'

export interface Key {
  publicKey?: string,
  privateKey?: string
}

export default function RSAKeys() {
  const dispatch = useDispatch()
  const {crypt, encrypt, decrypt, userInfo} = useSelector<any, GlobalState>(state => state.global)
  const [createDisabled, setCreateDisabled] = useState(false);
  const [text, setText] = useState('');
  const [miText, setMitext] = useState('');
  const [deText, setDetext] = useState('')
  const [reset, setReset] = useState(false) // 是否需要重置私钥

  const { privateKey, publicKey } = userInfo

  useEffect(() => {
    // 暂时未处理如果本地缓存的key呗清除的情况
    if (publicKey) {
      if (!privateKey) {
        setReset(true)
        Taro.navigateTo({ url: '/pages/Profile/subpages/PrivateKey/index' })
      } else {
        const en = encrypt.encrypt('hello')
        const de = decrypt.decrypt(en)
        if (!de) {
          setReset(true)
          Taro.navigateTo({ url: '/pages/Profile/subpages/PrivateKey/index' })
        }
      }
      setCreateDisabled(true)
    }
  }, [])

  useEffect(() => {
    publicKey && encrypt.setPublicKey(publicKey)
    privateKey && decrypt.setPrivateKey(privateKey)
    
    const en = encrypt.encrypt('hello')
    const de = decrypt.decrypt(en)
    if (!de) {
      setReset(true)
    } else {
      setReset(false)
    }
  }, [privateKey, publicKey])

  function createKeys() {
    if (createDisabled) {
      return;
    }

    const res = Taro.getStorageSync('userInfo');
    
    if (!res || !res._id) {
      Taro.navigateTo({ url: '/pages/Auth/index' })
      return;
    }
    
    crypt.getKey();
    const rsa = {
      publicKey: crypt.getPublicKey(),
      privateKey: crypt.getPrivateKey()
    }
    
    dispatch({type: 'global/userInfo', payload: rsa})
    Taro.setStorageSync('rsa', rsa)
    const userinfo: UserInfo = Taro.getStorageSync('userInfo')
    if (userinfo._id) {
      userinfo.publicKey = rsa.publicKey;
      Taro.setStorageSync('userInfo', userinfo)
      userUpdateApi(userinfo._id, { publicKey: rsa.publicKey });
    }
    encrypt.setPublicKey(rsa.publicKey)
    decrypt.setPrivateKey(rsa.privateKey)
    setCreateDisabled(true)
  }

  function encryption() {
    setMitext(encrypt.encrypt(text));
  }

  function decryption() {
    setDetext(decrypt.decrypt(miText));
  }

  function copy(content: string) {
    Taro.setClipboardData({
      data: content,
      success: () => {
        Taro.showToast({title: '已复制', icon: 'success'})
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
            userUpdateApi(userinfo._id, { privateKey }).then(res => {
              Taro.showToast({ title: '存储成功！', icon: 'success' })
            });
          }
        }
      }
    })
  }

  return (
    <View className="rsa_container">
      <View className="text_wrap"><Text className="introduce">「码易」使用 RSA 加密保护您的账号。</Text></View>
      <View className="text_wrap"><Text className="introduce">RSA 是一种非对称加密技术。用户可以在该页面生一对秘钥，分别为公钥跟私钥，私钥由用户自己保存，公钥存储在码易数据库中。您的账户信息将由公钥私钥共同加密，最终也只能由公钥秘钥共同解密，当您生成专属公钥秘钥之后，可以在下方尝试观察加密之后的数据。为了您的安全考虑，我们会将您的数据加密之后，存储在数据库中，也就意味着，即使是开发者，也只能看到您加密之后的数据。私钥我们会帮您存储在本地缓存之中，如果您删除「码易」小程序，您的私钥就会遗失，那么您的信息就再也没有人能够解密了。因此为了防止意外情况，请一定要保存好您的私钥，它是读取您数据信息的唯一凭证。</Text></View>
      
      <AtButton className="create" type="primary" onClick={createKeys} disabled={createDisabled}>生成专属公钥私钥对</AtButton>
      
      {publicKey && (
        <Block>
          <View className="title">您的专属公钥</View>
          <View className="key">{publicKey || ""}</View>

          <View className="title">您的专属私钥</View>
          <View className="warn">私钥请您务必妥善保管，它是解密您加密数据的唯一凭证，遗失后您的数据将无人能够读取</View>
          <View className="key">{privateKey || ''}</View>
          {reset ? (
            <View className="reset_wrap">
              <View className="tip" onClick={() => Taro.navigateTo({ url: '/pages/Profile/subpages/PrivateKey/index' })}>
                您的私钥丢失或者错误，需要补全后才可以正确解密，点击补全
              </View>
            </View>
          ) : (
            <View className="btn_group">
              <Button className="btn" onClick={() => copy(privateKey || '')}>点击复制私钥</Button>
              <Button className="btn" onClick={save}>我帮您保存</Button>
            </View>
          )}
        </Block>
      )}
      
      {privateKey && publicKey && (
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
