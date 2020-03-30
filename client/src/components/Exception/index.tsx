import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './style.less';

export type ExceptionType = 'default' | 'noData'

  const remote = {
    ExceptionNoData: require('./images/noData.png')
  }

const imageSource: { [key: string]: any } = {
  default: {
    image: remote.ExceptionNoData,
    message: '暂无相关内容~'
  },
  noData: {
    image: remote.ExceptionNoData,
    message: '暂无相关数据~'
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
