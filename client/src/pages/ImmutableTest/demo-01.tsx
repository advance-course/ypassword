// demo 01
// 按下按钮之后，App的 render function 被触发，然后Table的 render function 也被触发，所以重新渲染了一次整个列表。
// 可是我们点击按钮之后，list根本没变，其实是不需要重新渲染的
import Taro, { useState } from '@tarojs/taro';
import { View, Button } from '@tarojs/components'

export interface Item {
  id: number
}

export default function App () {
  /** 新增 <Item[]> 泛型，用以说明list的数据类型 */
  let [list, setList] = useState<Item[]>(() => {
    return Array(10).fill(0).map((val, index) => ({id: index}))
  })
  console.log(list)
  let [otherState, setOtherState] = useState(0)
  return (
    <View>
      <Button onClick={() => setOtherState(otherState + 1)}>change state!</Button>
      otherState:{otherState}
      {list.map((item) => (
        <View key={item.id}>{item.id}</View>
      ))}
  </View>
  )
}
