import Taro, { useState, useEffect, Config, useRef } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { AtInput } from 'taro-ui'

export default function PasswordRest() {

  function getPhoneNumber(e) {
    console.log(e)
  }

  return (
    <View>
      <AtInput
        clear
        title="手机号"
        placeholder="请输入微信手机号"
      >
      </AtInput>

      <Button open-type="getPhoneNumber" onGetPhoneNumber={getPhoneNumber}>
        下一步
      </Button>
    </View>
  )
}

PasswordRest.config = {
  navigationBarTitleText: '找回密码',
} as Config;