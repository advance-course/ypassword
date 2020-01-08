import Taro, { Config,useEffect } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { icons } from './config';
import "./index.scss";
import MyIcon from 'components/myIcon';

export default function IconIndex() {
  useEffect(() => {
    Taro.getSetting().then(res => {
      console.log(res);
      if (!res.authSetting || !res.authSetting['scope.userInfo']) {
        Taro.navigateTo({ url: '../Auth/index' });
      }
    })
  }, []);

  return (
    <View className="container">
      {icons.map((item, i) => (
        <View key={i} className='itemContainer'>
            <MyIcon name={item} />
            <Text className='itemStyle'>{item}</Text>
          </View>
        ))}

      <View>
        设置字体大小
        <MyIcon name='RectangleCopy5' size={60} ></MyIcon>
      </View>

      <View>
        设置颜色
        <MyIcon name='jian' color={'#f0f'} ></MyIcon>
      </View>

      <View>
        设置旋转
        <MyIcon name='jian'   spin ></MyIcon>
      </View>

      <View>
        测试字体
        <View> https://www.iconfont.cn/collections/detail?cid=16880</View>
        <View className='din'>this is DIN English font</View>
      </View>

    </View>
  );
}

IconIndex.config = {
  navigationBarTitleText: '图标',
} as Config;
