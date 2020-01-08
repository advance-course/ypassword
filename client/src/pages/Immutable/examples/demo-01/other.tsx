import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

const Other = (props: { other: number }) => {
  const {other} = props
    return (
      <View>
        other:{other}
      </View>
    )
}

export default Other
