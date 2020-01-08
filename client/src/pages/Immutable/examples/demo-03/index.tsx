// memo优化row，使得list改变时不重复render未改变的item
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
