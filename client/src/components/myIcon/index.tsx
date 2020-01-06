import { Text } from '@tarojs/components'
import classNames from 'classnames';
import './index.scss';

interface MyIconProps {
  type: string;
  size?: number;
  className?: string;
  color?: string;
  style?:any;
  prefixClass?: string;
}

const MyIcon: React.FC<MyIconProps> = ({
  // customStyle,
  className = '',
  prefixClass = 'icon',
  type = '',
  size = 24,
  color = ''
}) => {


  const rootStyle = {
    fontSize: `${Taro.pxTransform(size * 2)}`,
    color
  }

  const iconName = type ? `${prefixClass}-${type}` : ''
  return (
    <Text
      className={classNames(
        'iconfont',
        prefixClass,
        iconName,
        className
      )}
      style={rootStyle}
    >
    </Text>
  )
}
export default MyIcon;
