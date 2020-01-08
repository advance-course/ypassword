import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

const Item = (props: { item: Item }) => {
  const { item } = props
  return (
    <View>{item.id}</View>
  )
}
Item.defaultProps = { id: null }
export default Item
