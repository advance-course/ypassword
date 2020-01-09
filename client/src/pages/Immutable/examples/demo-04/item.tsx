import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

const Item = (props: { item: Item, itemStyle: Object }) => {
  const { item } = props
  return (
    <View>{item.id}</View>
  )
}
export default Taro.memo(Item)
