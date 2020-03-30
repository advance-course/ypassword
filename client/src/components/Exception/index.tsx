import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './style.less';

export type ExceptionType =
  | 'default'
  | 'accessDenied'
  | 'dataFault'
  | 'noCoupon'
  | 'noData'
  | 'noMessage'
  | 'noOrder'
  | 'noSearch'
  | 'pageLost'
  | 'timeOut';

  const remote = {
    ExceptionNoData: require('./images/noData.png'),
    ExceptionAccessDenied: require('./images/accessDenied.png'),
    ExceptionDataFault: require('./images/dataFault.png'),
    ExceptionNoCoupon: require('./images/noCoupon.png'),
    ExceptionNoMessage: require('./images/noMessage.png'),
    ExceptionNoOrder: require('./images/noOrder.png'),
    ExceptionNoSearch: require('./images/noSearch.png'),
    ExceptionPageLost: require('./images/pageLost.png'),
    ExceptionTimeOut: require('./images/timeOut.png')
  }

const imageSource: { [key: string]: any } = {
  default: {
    image: remote.ExceptionNoData,
    message: '暂无相关内容~'
  },
  accessDenied: {
    image: remote.ExceptionAccessDenied,
    message: '暂无访问权限~'
  },
  dataFault: {
    image: remote.ExceptionDataFault,
    message: '获取数据失败~'
  },
  noCoupon: {
    image: remote.ExceptionNoCoupon,
    message: '暂无优惠券~'
  },
  noData: {
    image: remote.ExceptionNoData,
    message: '暂无相关数据~'
  },
  noMessage: {
    image: remote.ExceptionNoMessage,
    message: '暂无任何消息~'
  },
  noOrder: {
    image: remote.ExceptionNoOrder,
    message: '暂无订单~'
  },
  noSearch: {
    image: remote.ExceptionNoSearch,
    message: '暂无搜索结果~'
  },
  pageLost: {
    image: remote.ExceptionPageLost,
    message: '页面走丢了~'
  },
  timeOut: {
    image: remote.ExceptionTimeOut,
    message: '当前网络不给力，请下拉刷新~'
  }
};

export interface ExceptionProps {
  height?: number;
  message?: string;
  type?: ExceptionType;
  children?: any;
}

function Exception({ height, type = 'default', message, children }: ExceptionProps) {
  return (
    <View className="exception" style={height ? { height: `${height}rpx` } : {}}>
      <Image className="image" src={imageSource[type].image} mode="widthFix" />
      {message ? <Text className="text">{message}</Text> : <Text className="text">{imageSource[type].message}</Text>}
      <Text className="text">{children}</Text>
    </View>
  );
}

export default Exception;
