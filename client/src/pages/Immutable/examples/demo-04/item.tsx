import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

const Item = (props: { item: Item, itemStyle: Object }) => {
  const { item } = props
  // console.log('render Item', item.id)
  return (
    <View>{item.id}</View>
  )
}
export default Taro.memo(Item)
