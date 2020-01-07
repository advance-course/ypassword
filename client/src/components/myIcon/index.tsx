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
  spin?: boolean;
}
// 使用React.FC泛型类型
const MyIcon: React.FC<MyIconProps> = ({
  // customStyle,
  className = '',
  prefixClass = 'icon',
  type = '',
  size = 24,
  color = '',
  spin = false,
}) => {


  const rootStyle = {
    fontSize: `${Taro.pxTransform(size * 2)}`,
    color
  }

  const iconName = type ? `${prefixClass}-${type}` : '';

  const iconSpin = spin ? `${prefixClass}-spin` : '';

  return (
    <Text
      className={classNames(
        'iconfont',
        prefixClass,
        iconSpin,
        iconName,
        className,
      )}
      style={rootStyle}
    >
    </Text>
  )
}
export default MyIcon;
