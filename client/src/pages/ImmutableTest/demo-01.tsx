// demo 01
// 按下按钮之后，App的 render function 被触发，然后Table的 render function 也被触发，所以重新渲染了一次整个列表。
// 可是我们点击按钮之后，list根本没变，其实是不需要重新渲染的
import Taro, { useState } from '@tarojs/taro';
import { View } from '@tarojs/components'

function Row (props) {
  const {item} = props
  return (
    <tr>
      <td>{item.id}</td>
    </tr>
  )
}

const Table = (props) => {
  console.log('render Table')
  const {list} = props
  return (
    <table>
      <tbody>
        {list.map(item => <Row key={item.id} item={item} />)}
      </tbody>
    </table>
  )
}

export default function App () {
  let [list, setList] = useState(() => {
    return Array(10).fill(0).map((val, index) => ({id: index}))
  })
  console.log(list)
  let [otherState, setOtherState] = useState(0)
  return (
    <View>
      <button onClick={() => setOtherState(otherState + 1)}>change state!</button>
      otherState:{otherState}
      <Table list={list}></Table>
  </View>
  )
}
