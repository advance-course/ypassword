import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

const Item = (props: { item: Item }) => {
  const { item } = props
  console.log('test Item ***', item)
  return (
    <View>{item.id}</View>
  )
}
export default Item
