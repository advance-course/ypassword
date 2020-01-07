// demo-03
// 使用useMemo分别记忆list和otherState
import Taro, { useState, useMemo } from '@tarojs/taro'

interface Item {
  id: number
}

function Row (props) {
  const {item, style} = props
  return (
    <tr style={style}>
      <td>{item.id}</td>
    </tr>
  )
}

function Table(props: { list: Item[] }) {
  console.log('render Table')
  const {list} = props
  const itemStyle = {
    color: 'red'
  }
  return (
    <table>
      <tbody>
        {list.map(item => <Row key={item.id} item={item} style={itemStyle} />)}
      </tbody>
    </table>
  )
}

export default function App () {
  let [otherState, setOtherState] = useState(0)
  let [list, setList] = useState(() => {
    return Array(10).fill(0).map((val, index) => ({id: index}))
  })

  const otherChild = useMemo(() => {
    return (
      <div>
      otherState:{otherState}
      </div>
    )
  }, [otherState])

  const listChild = useMemo(() => {
    return (
      <Table list={list} />
    )
  }, [list])

  return (
    <div>
      <button onClick={() => setOtherState(otherState + 1)}>change state!</button><br/>
      <button onClick={() => setList([...list, {id: list.length}])}>change List!</button><br/>
      {/* {otherChild}
      {listChild} */}
    </div>
  )
}
