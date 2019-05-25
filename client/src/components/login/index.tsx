import Taro, { useState } from "@tarojs/taro"
import { View, Text, Button } from "@tarojs/components"

export default function Login() {
  const [context, setContext] = useState();

  function getLogin() {
    Taro.cloud.callFunction({ name: 'login' }).then(res => {
      setContext(res.result);
    })

    Taro.cloud.callFunction({
      name: 'enterpriseInfo',
    }).then(res => {
      console.log(res);
    }).catch(e => {
      console.log(e.message);
    })
  }

  function getUserInfo() {
    Taro.cloud.callFunction({
      name: 'userInfoApi'
    }).then(res => {
      console.log(res);
    }).catch(e => {
      console.log(e.message);
    })
  }

  return (
    <View className='index'>
      <Button onClick={getLogin}>get Login Info</Button>
      <Text>context：{JSON.stringify(context)}</Text>
      <Button onClick={getUserInfo}>get User Info</Button>
    </View>
  )
}
