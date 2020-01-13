import Taro, { useState, useEffect } from "@tarojs/taro"
import { View } from "@tarojs/components"
import classNames from 'classnames';
import "./index.scss";
import "taro-ui/dist/style/components/icon.scss";

export default function CardItem(props) {
    const [activeIndex, setActiveIndex] = useState(undefined);
    const [beforeIndex, setBeforeIndex] = useState(undefined);

    useEffect(() => {
      blurClick();
    }, [props.tick])


    function itemClick (index) {
      setBeforeIndex(activeIndex);
      if (index === activeIndex) {
        setActiveIndex(undefined);
        return;
      }
      setActiveIndex(index);
    }

    function blurClick() {
      setBeforeIndex(activeIndex);
      setActiveIndex(undefined);
    }

    // 之前都是正常元素
    const before_none_active = beforeIndex === undefined;
    // 现在都是正常元素
    const current_none_active = activeIndex === undefined;

    return (
    <View className="container">
        <View className="mask" onClick={blurClick} />
        {
          props.list.map((item, index) => {
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

            return (
              <View
                key={index}
                className={classNames('box',  'animate',
                  {
                    normal_to_active,
                    normal_to_unactive,
                    active_to_normal,
                    active_to_unactive,
                    unactive_to_normal,
                    unactive_to_active,
                    unactive,
                  }
                )}
                onClick={itemClick.bind(this, index)}
                >
                <View className="box_item">
                    <View className="who_icon">{item.title}</View>
                    <View className="info">
                    <View>{item.username}</View>
                    <View>{item.password}</View>
                    </View>
                    <View className={
                      classNames('at-icon', 'animate',
                      {
                        'at-icon-check-circle': normal_to_active || unactive_to_active,
                        'at-icon-clock': current_none_active || active_to_normal || unactive_to_normal || normal_to_unactive || active_to_unactive,
                      })
                    } />
                </View>
                <View className="detail_item">
                    <View className="detail">
                    <View>用户名称</View>
                    <View>{item.username}</View>
                    </View>
                    <View className="detail">
                    <View>密码</View>
                    <View>●●●●●●</View>
                    </View>
                </View>
              </View>)
          })
        }
    </View>
    )
}

CardItem.defaultProps = {
  list: []
}