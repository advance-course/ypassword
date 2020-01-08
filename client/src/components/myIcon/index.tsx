import { Text } from '@tarojs/components'
import classNames from 'classnames';
import './index.scss';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
  style?:any;
  prefixClass?: string;
  spin?: boolean;
}
// 使用React.FC泛型类型
const MyIcon: React.FC<IconProps> = ({
  // customStyle,
  className = '',
  prefixClass = 'icon',
  name = '',
  size = 24,
  color = '',
  spin = false,
}) => {
  const rootStyle = {
    fontSize: `${Taro.pxTransform(size * 2)}`,
    color
  }
  const iconName = name ? `${prefixClass}-${name}` : '';
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
