import Taro, { useEffect } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Text } from '@tarojs/components';
import MyIcon from 'components/myIcon';
import {auth} from './entity';
import "./index.scss";

export default function Index() {
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
      <Swiper circular indicatorDots autoplay>
        <SwiperItem>
          <View>1</View>
        </SwiperItem>
        <SwiperItem>
          <View>2</View>
        </SwiperItem>
        <SwiperItem>
          <View>3</View>
        </SwiperItem>
      </Swiper>

      <View className="wrapper">
        {auth.map((item) => (
          <View key={item.icon} className="auth" onClick={() => {Taro.navigateTo({url: item.path})}}>
            <MyIcon name={item.icon} size={40} />
            <Text className="title">{item.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
