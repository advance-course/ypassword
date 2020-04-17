import Taro, { useState } from "@tarojs/taro"
import { View, Image, Text } from "@tarojs/components"
import classNames from 'classnames';
import { ITouchEvent } from '@tarojs/components/types/common';

import "taro-ui/dist/style/components/icon.scss";
import "./index.scss";
import { useDispatch } from '@tarojs/redux';

export interface AccountListProps {
  ids: string[],
  accounts: {
    [key: string]: com.Account
  }
}
/**
 * 由于Taro 2.0.7 在编译上存在一些bug，无法将阻止冒泡转化编译成 catchtap，因此最终效果上会有一些问题
 * 每次build之后，需要在dist对应的文件中修改 bindtap 为 catchtap
 */
export default function AccountList(props: AccountListProps) {
  const {ids = [], accounts} = props;
  const [activeIndex, setActiveIndex] = useState();
  const [beforeIndex, setBeforeIndex] = useState();
  const dispatch = useDispatch()

  const itemClick = (index) => {
    setBeforeIndex(activeIndex);
    if (index === activeIndex) {
      setActiveIndex(undefined);
      return;
    }
    setActiveIndex(index);
  }

  const iconClickHandler = (item: com.Account, e: ITouchEvent) => {
    e.stopPropagation();
    dispatch({
      type: 'account/accountInfo',
      payload: item
    })
    Taro.navigateTo({ url: `/pages/Accounts/subpages/Detail/index` })
  }

  function copyHandler(content: string, e: ITouchEvent) {
    e.stopPropagation();
    Taro.setClipboardData({
      data: content,
      success: () => {
        Taro.showToast({ title: '复制成功', icon: 'success' })
      }
    })
  }

  // 之前都是正常元素
  const before_none_active = beforeIndex === undefined;
  // 现在都是正常元素
  const current_none_active = activeIndex === undefined;

  return (
    <View className="container">
      {
        ids.map((id, index) => {
          // 之前是激活元素
          const before_is_active = beforeIndex === index;
          // 之前是非激活元素
          const before_has_active = beforeIndex !== undefined && beforeIndex !== index;
          // 现在是激活元素
          const current_is_active = activeIndex === index;
          // 现在是非激活元素
          const current_has_active = activeIndex !== undefined && activeIndex !== index;

          // 正常到激活
          const normal_to_active = before_none_active && current_is_active;
          // 正常到非激活
          const normal_to_unactive = before_none_active && current_has_active;
          // 激活到正常
          const active_to_normal = before_is_active && current_none_active;
          // 激活到非激活
          const active_to_unactive = before_is_active && current_has_active;
          // 非激活到正常
          const unactive_to_normal = before_has_active && current_none_active;
          // 非激活到激活
          const unactive_to_active = before_has_active && current_is_active;
          // 持续非激活
          const unactive = before_has_active && current_has_active;

          const cls = classNames('box', 'animate', {
            normal_to_active,
            normal_to_unactive,
            active_to_normal,
            active_to_unactive,
            unactive_to_normal,
            unactive_to_active,
            unactive,
          })

          const iconCls = classNames('at-icon', 'animate', {
            'at-icon-chevron-right': normal_to_active || unactive_to_active,
            'at-icon-clock': current_none_active || active_to_normal || unactive_to_normal || normal_to_unactive || active_to_unactive,
          })

          const item = accounts[id];

          return (
            <View key={`${item.title}${item.username}`} className={cls} onClick={() => itemClick(index)}>
              <View className="box_item">
                  <View className={item.category && item.category.imgUrl ? 'who_icon' : 'who_icon no'}>
                    {item.category && item.category.imgUrl ? (
                      <Image className="category_img" src={item.category.imgUrl} mode="aspectFill" />
                    ) : (
                      <Text className="title_text">{item.title ? item.title.charAt(0) : 'N'}</Text>
                    )}
                  </View>
                  <View className="info">
                    <View className="username">{item.username}</View>
                    {item.password && <View className="password">{item.password}</View>}
                  </View>
                  <View className={iconCls} onClick={(e) => iconClickHandler(item, e)} />
              </View>
              <View className="detail_item">
                <View className="detail" onClick={copyHandler.bind(this, item.username)}>
                  <View className="tip">用户名称</View>
                  <View className="content">{item.username}</View>
                </View>
                <View className="detail" onClick={e => copyHandler(item.password || '', e)}>
                  <View className="tip">密码</View>
                  <View className="content">{item.password}</View>
                </View>
              </View>
            </View>)
        })
      }
    </View>
  )
}