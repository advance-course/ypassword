import Taro, { useEffect, navigateTo } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Text, Image } from '@tarojs/components';
import MyIcon from 'components/myIcon';
import {auth} from './entity';
import "./index.scss";

import demo01 from './images/demo01.jpeg';
import demo02 from './images/demo02.png';

const banners = [{
  url: 'https://mp.weixin.qq.com/s/7WQYxRDVCGxWkbxmRqnLlQ',
  img: demo01,
  title: '认同感，是高效学习的第一步'
}, {
  url: 'https://mp.weixin.qq.com/s/DfybAmCzUjrczxMqS532lw',
  img: demo02,
  title: 'TypeScript: 为什么必须学'
}]

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
      <Swiper circular autoplay>
        {banners.map((item) => (
          <SwiperItem key={item.url}>
            <View className="sp_item" onClick={() => navigateTo({ url: `/pages/webview/index?url=${item.url}` })}>
              <Image className="sp_img" mode="aspectFill" src={item.img} />
              <View className="sp_titleview">
                <Text className="sp_titletext">{item.title}</Text>
              </View>
            </View>
          </SwiperItem>  
        ))}
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
