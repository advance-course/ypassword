import Taro, { useState, useEffect } from "@tarojs/taro"
import { View } from "@tarojs/components"
import { AtIcon } from 'taro-ui';
import classNames from 'classnames';
import "./index.scss";

export default function CardItem(props) {
    const [clickIndex, setClickIndex] = useState(undefined);
    const [clickBeforeIndex, setClickBeforeIndex] = useState(undefined);

    useEffect(() => {
      blurClick();
    }, [props.tick])


    function itemClick (index) {
      setClickBeforeIndex(clickIndex);
      if (index === clickIndex) {
        setClickIndex(undefined);
        return;
      }
      setClickIndex(index);
    }

    function blurClick() {
      setClickBeforeIndex(clickIndex);
      setClickIndex(undefined);
    }

    return (
    <View className="container">
        <View className="mask" onClick={blurClick} />
        {
          props.list.map((item, index) => {
            const actived = clickIndex === index;
            const has_actived = clickIndex !== undefined && !actived;
            const fade_out = clickBeforeIndex === index && clickIndex === undefined;

            return (<View
              key={index}
              className={classNames('box',  'animate',
                {
                  actived,
                  has_actived,
                  fade_out
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
                  <AtIcon value={actived ? 'check-circle' : has_actived ? '' : 'clock'} size={actived ? 26 : 20} color="#cad0d9" />
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