import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

const Other = (props: { other: number }) => {
  console.log('render other')
  const {other} = props
    return (
      <View>
        other:{other}
      </View>
    )
}

export default Taro.memo(Other)
