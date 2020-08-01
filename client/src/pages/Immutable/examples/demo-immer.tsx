// demo-immer
import Taro, { useState } from '@tarojs/taro';
import { View, Button } from '@tarojs/components'
import produce from 'immer'

export default function App () {
  const [state, setState] = useState({ title: 'zp', list: [
      { id: 1, name: 'hello' },
      { id: 2, name: 'world' }
    ]
  })

  const nextState = produce(state, dstate => {
    dstate.list[1].name = 'world2'
    dstate.title = 'zt'
  })

  return (
    <View key='a'>
      <Button onClick={() => setState(nextState)}>set new state</Button>
      title: {state.title}
      {state.list.map((item) => {
        return (
          <View key={item.id}>
            <View>id: {item.id}</View>
            <View>name: {item.name}</View>
          </View>
        )
      })}
    </View>
  )
}
