// demo-immer
import Taro, { useState } from '@tarojs/taro';
import produce from 'immer'

export default function App () {
  const state = {
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
  const nextState = produce(state, draftState => {
    draftState.list[1].name = 'world2'
    draftState.title = 'zt'
  })
  return (
    <div key='a'>
      title: {nextState.title}
      {nextState.list.map((item) => {
        return (
          <div key={item.id}>
            <div>id: {item.id}</div>
            <div>name: {item.name}</div>
          </div>
        )
      })}
    </div>
  )
}
