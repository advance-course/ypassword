// demo-04
// memo优化row
import Taro, { useState, useMemo } from '@tarojs/taro'

interface Item {
  id: number
}

const MemoizedRow = React.memo(function Row(props: { item: Item}) {
  console.log('render row')
  const {item} = props
  return (
    <tr>
      <td>{item.id}</td>
    </tr>
  )
})

function Table(props: { list: Item[] } ) {
  console.log('render Table')
  const {list} = props
  return (
    <table>
      <tbody>
        {list.map(item => <MemoizedRow key={item.id} item={item}/>)}
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
      <>
      otherState:{otherState}
      </>
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
      {otherChild}
      {listChild}
    </div>
  )
}
