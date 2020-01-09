import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

const Item = (props: { item: Item }) => {
  const { item } = props
  return (
    <View>{item.id}</View>
  )
}
export default Item
