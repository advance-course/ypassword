import Taro from '@tarojs/taro';
import { View } from '@tarojs/components'

import GestureLock from '../../components/GestureLock'

import './index.scss';

interface DrawUnlockProps {};
export default function DrawUnlock(props):DrawUnlockProps {

  return (
    <View>
      <GestureLock />
    </View>
  )
}

DrawUnlock.config = {
  disableScroll: true
}

