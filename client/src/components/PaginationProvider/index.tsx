import Taro, {useEffect} from '@tarojs/taro'
import { CSSProperties } from 'react'
import { View, Text } from '@tarojs/components'
import MyIcon from 'components/myIcon'
import Exception from 'components/Exception'
import classnames from 'classnames'
import './index.scss'

export interface PaginationProviderProps {
  loading?: boolean,
  errMsg?: string,
  increasing: boolean,
  lastPage: boolean,
  style?: CSSProperties,
  className?: string,
  children?: any,
  length?: number
}

export default function PaginationProvider(props: PaginationProviderProps) {
  const { loading, errMsg, increasing, lastPage, style, className, children, length } = props;

  useEffect(() => {
    if (loading) {
      Taro.showLoading({title: '加载中...'})
    } else {
      Taro.hideLoading();
    }
  }, [loading])

  const cls = classnames('pagination_provider', {
    // @ts-ignore
    [className]: !!className
  })

  if (errMsg) {
    return (
      <View className={cls} style={style}>
        <Exception type="noData" message={errMsg} />
      </View>
    )
  }

  if (length === 0 && !loading) {
    return (
      <View className={cls} style={style}>
        <Exception type="noData" message="您关注的专栏暂时没有发布文章" />
      </View>
    )
  }

  const renderFooter = () => {
    if (increasing && lastPage) {
      return (
        <View className="pagination_bottom">
          <MyIcon className="loading" name="settings" size={26} spin />
          <Text className="desc">数据加载中...</Text>
        </View>
      )
    }

    if (lastPage) {
      return (
        <View className="pagination_bottom">
          <Text className="desc">--- end ---</Text>
        </View>
      )
    }

    return (
      <View className="pagination_bottom" />
    )
  }

  return (
    <View className={cls} style={style}>
      {children}
      {renderFooter()}
    </View>
  )
}

PaginationProvider.options = {
  addGlobalClass: true
};