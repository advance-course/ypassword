import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { useSelector } from '@tarojs/redux';
import { GlobalState } from 'store/global';

function PlaceholderView() {
  const global = useSelector<any, GlobalState>(state => state.global)
  console.log(global.systemInfo)

  return (
    <View style={{height: global.systemInfo.placeHolderHeight}} />
  )
}

export default PlaceholderView;
