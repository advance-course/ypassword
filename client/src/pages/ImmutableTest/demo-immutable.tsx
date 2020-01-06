// demo-immutable
import Taro from '@tarojs/taro'
import { fromJS } from 'immutable'

export default function App() {
  const stateMap = fromJS({
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
  })


  const newStateMap  = stateMap.updateIn(['list'], list => {
    return list.update(1, item => item.set('name', 'world2'))
  })

  let immutableObj = newStateMap.toJS()
  console.log(immutableObj)

  return (
    <div>
      title: {immutableObj.title}
      {immutableObj.list.map((item) => {
        return (
          <div key={item.id}>
            <div>id: {item.id}</div>
            <div>name: {item.name}</div>
          </div >
        )
      })}
    </div>
  )
}
