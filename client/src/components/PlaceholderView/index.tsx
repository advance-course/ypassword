import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { useSelector } from '@tarojs/redux';
import { GlobalState } from 'store/global';

function PlaceholderView() {
  const global = useSelector<any, GlobalState>(state => state.global)
  const {placeHolderHeight} = global.systemInfo

  return (
    <View style={{height: `${placeHolderHeight!/2}Px`, background: 'rgba(0, 0, 0, 0)'}} />
  )
}

export default PlaceholderView;
