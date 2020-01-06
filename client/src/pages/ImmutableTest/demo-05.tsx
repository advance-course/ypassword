// demo-05
// 这里有个问题，itemStyle这个props，我们每次 render 的时候都创建了一个新的对象，
// 所以对于Row来说，尽管props.item 是一样的，但是props.style却是[每次都不一样]。
// 如果你已经知道每次都会不一样，那memo这时候就没有用了，而且还更糟，因为它帮你做了shallowEqual。shallowEqual也是需要执行时间的。
// 所以在已知props的比较每次都失败的话，就不需要比较了。
import Taro, { useState, useMemo } from '@tarojs/taro'

interface Item {
  id: number
}

const MemoizedRow = React.memo(function Row  (props: {item: Item, style: object}) {
  console.log('render row')
  const {item, style} = props
  return (
    <tr style={style}>
      <td>{item.id}</td>
    </tr>
  )
})

function Table (props) {
  console.log('render Table')
  const {list} = props
  const itemStyle = {
    color: 'red'
  }
  return (
    <table>
      <tbody>
        {list.map(item => <MemoizedRow key={item.id} item={item} style={itemStyle} />)}
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
