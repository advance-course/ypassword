import Taro, {useEffect} from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Icon from 'components/myIcon'

export interface PaginationProviderProps {
  loading: boolean,
  errMsg?: string,
  increasing?: boolean,
  lastPage?: boolean,
  style?: StyleSheet,
  className?: string,
  children?: Element
}

export default function PaginationProvider(props: PaginationProviderProps) {
  const { loading, errMsg, increasing, lastPage, style, className, children } = props;

  useEffect(() => {
    if (loading) {
      Taro.showLoading({title: '加载中...'})
    } else {
      Taro.hideLoading();
    }
  }, [loading])

  if (errMsg) {
    Taro.showToast({title: errMsg, icon: 'none'})
    return null;
  }

  return (
    <View className="pagination_provider">
      {children}
      {increasing && !lastPage && (
        <View className="pagination_bottom">
          <Icon name="" size={18} spin />
          <Text>数据加载中...</Text>
        </View>
      )}
      {lastPage && (
      <View className="pagination_bottom">
        <Icon name="" size={18} spin />
        <Text>已经到底啦</Text>
      </View>
      )}
    </View>
  )
}