import Taro, { Config } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui';

export default function Index() {
  return (
    <View className="container">
      <AtList>
        <AtListItem
          title="demo1"
          extraText="说明是一下案例的内容"
          arrow="right"
          onClick={() => Taro.navigateTo({ url: "/pages/Immutable/examples/demo-01" })}
        />

        <AtListItem
          title="demo2"
          extraText="说明是一下案例的内容"
          arrow="right"
          onClick={() => Taro.navigateTo({ url: "/pages/Immutable/examples/demo-02" })}
        />

        <AtListItem
          title="demo3"
          extraText="说明是一下案例的内容"
          arrow="right"
          onClick={() => Taro.navigateTo({ url: "/pages/Immutable/examples/demo-03" })}
        />
      </AtList>
    </View>
  );
}

Index.config = {
  navigationBarTitleText: '不可变数据集案例',
} as Config;
