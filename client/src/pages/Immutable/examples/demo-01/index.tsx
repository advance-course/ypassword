// 按下按钮之后，App的 render function 被触发，然后List的 render function 也被触发，所以重新渲染了一次整个列表。
// 但是点击按钮之后，list根本没变，其实是不需要重新渲染的
import Taro, { useState } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import List from './list'
import Other from './other'

export default function App() {
  let [other, setOther] = useState(0)
  let [list, setList] = useState<Item[]>(() => {
    return Array(10).fill(0).map((val, index) => ({ id: index }))
  })

  return (
    <View>
      <Button onClick={() => setOther(other + 1)}>change other!</Button>
      <Button onClick={() => setList([...list, { id: list.length }])}>change List!</Button>
      <Other other={other}></Other>
      <List list={list}  ></List>
    </View>
  )
}
