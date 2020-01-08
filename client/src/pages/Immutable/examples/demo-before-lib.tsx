// demo-before-lib
import Taro, { useState } from '@tarojs/taro'
import {View, Button} from '@tarojs/components'

export default function App() {
  const [state, setState] = useState(() => {
    return {
      title: 'zp',
      list: [
        {
          id: 1,
          name: 'hello'
        }, {
          id: 2,
          name: 'world'
        }
      ]
    }
  })

  // 要注意这里只是 shallow copy 而已
  // list[0] === props.list[0] => true
  const list = [...state.list.slice(0, 1)]
  const data = state.list[1]

  const nextState = {
    ...state,
    list: [...list, {
      ...data,// 再做一次 spread oprator
      name: 'world2'
    }]
  }

  console.log(state.list === nextState.list) // false
  console.log(state.list[0] === nextState.list[0]) // true
  console.log(state.list[1] === nextState.list[1]) // false
  return (
    <View>
      <Button onClick={() => setState(nextState)}>set new state</Button>
      <View>{state.title}</View>
      {state.list.map(item => {
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
