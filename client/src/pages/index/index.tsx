import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { inject, observer } from '@tarojs/mobx'
import './index.scss'

import Login from '../../components/login/index'
import { LoginStore } from 'src/store/login';

interface LoginProps {
  LoginStore: LoginStore
}

@inject('LoginStore')
@observer
export default class Index extends Component<LoginProps> {
  config: Config = {
    navigationBarTitleText: '首页'
  }

  render () {
    const { counter, increment, decrement, incrementAsync } = this.props.LoginStore;
    return (
      <View className='index'>
        <Login />
        <Button onClick={increment}>+</Button>
        <Button onClick={decrement}>-</Button>
        <Button onClick={incrementAsync}>add Async</Button>
        <Text>{counter}</Text>
      </View>
    )
  }
}
