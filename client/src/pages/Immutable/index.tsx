import Taro, { Config } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui';

export default function Index() {
  return (
    <View className="container">
      <AtList>
        <AtListItem
          title="demo1"
          note="重复的渲染"
          arrow="right"
          onClick={() => Taro.navigateTo({ url: "/pages/Immutable/examples/demo-01/index" })}
        />

        <AtListItem
          title="demo2"
          note="memo优化list和other"
          arrow="right"
          onClick={() => Taro.navigateTo({ url: "/pages/Immutable/examples/demo-02/index" })}
        />
        <AtListItem
          title="demo3"
          note="memo优化item"
          arrow="right"
          onClick={() => Taro.navigateTo({ url: "/pages/Immutable/examples/demo-03/index" })}
        />
        <AtListItem
          title="demo4"
          note="不适合使用memo"
          arrow="right"
          onClick={() => Taro.navigateTo({ url: "/pages/Immutable/examples/demo-04/index" })}
        />
        <AtListItem
          title="demo-before-lib"
          note="复杂数据-使用浅拷贝"
          arrow="right"
          onClick={() => Taro.navigateTo({ url: "/pages/Immutable/examples/demo-before-lib" })}
        />
        <AtListItem
          title="demo-immutable"
          note="复杂数据-使用immutable库"
          arrow="right"
          onClick={() => Taro.navigateTo({ url: "/pages/Immutable/examples/demo-immutable" })}
        />
        <AtListItem
          title="demo-immer"
          note="复杂数据-使用immer库"
          arrow="right"
          onClick={() => Taro.navigateTo({ url: "/pages/Immutable/examples/demo-immer" })}
        />
      </AtList>
    </View>
  );
}

Index.config = {
  navigationBarTitleText: '不可变数据集案例',
} as Config;
