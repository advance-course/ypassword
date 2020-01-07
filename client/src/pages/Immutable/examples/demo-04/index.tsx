// demo-05 不适合用memo的情况
// 这里有个问题，list里的itemStyle这个props，我们每次 render 的时候都创建了一个新的对象，
// 所以对于Row来说，尽管props.item 是一样的，但是props.style却是[每次都不一样]。
// 如果你已经知道每次都会不一样，那memo这时候就没有用了，而且还更糟，因为它帮你做了shallowEqual。shallowEqual也是需要执行时间的。
// 所以在已知props的比较每次都失败的话，就不需要比较了。
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
