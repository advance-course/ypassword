import Taro, { useEffect } from '@tarojs/taro';
import { View, Swiper, SwiperItem } from '@tarojs/components';
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
    <View style={{backgroundColor: 'orange'}}>
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
    </View>
  );
}
