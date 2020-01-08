// demo-immutable
import Taro, {useState} from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { fromJS } from 'immutable'

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
  const stateMap = fromJS(state)

  const newStateMap  = stateMap.updateIn(['list'], list => {
    return list.update(1, item => item.set('name', 'world2'))
  })

  let immutableObj = newStateMap.toJS()

  return (
    <View>
      <Button onClick={() => setState(immutableObj)}>set new state</Button>
      title: {state.title}
      {state.list.map((item) => {
        return (
          <View key={item.id}>
            <View>id: {item.id}</View>
            <View>name: {item.name}</View>
          </View >
        )
      })}
    </View>
  )
}
