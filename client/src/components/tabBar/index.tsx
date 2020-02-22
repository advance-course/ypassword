import Taro, { useState, useMemo, useCallback, useEffect } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import MyIcon from "components/myIcon";
import classNames from "classnames";
import "./index.scss";

interface TabItem {
  text: string;
  iconPath: string;
  badge?: number;
  dot?: boolean;
}

interface RealTabBarProps {
  initial?: boolean;
  current: number;
  backgroundColor: string;
  color: string;
  tintColor: string;
  onClick: (index: number) => any;
  fixed: boolean;
  tabList: TabItem[];
}

export default function RealTabBar({
  current = 0,
  color = "#999",
  tintColor = "#000",
  // fixed = false,
  onClick = () => {},
  tabList = [],
  initial = false
}: RealTabBarProps) {
  const [animated, setAnimated] = useState(false);
  const tabItemClick = (index: number) => {
    current !== index && onClick(index);
    current !== index && setAnimated(true);
  };
  return (
    <View className="tab-bar">
      <View className="tab-bar-wrap">
        {tabList.map((item, index) => (
          <View
            key={index}
            className="tab-bar-wrap-item"
            onClick={tabItemClick.bind(this, index)}
          >
            <View
              className={classNames({
                "tab-bar-wrap-item-iconGroup": true,
                animated: (animated || initial) && current === index,
                animateLine: index === 0,
                animateTranslate: index === 1,
                animateRotate: index === 2,
                animateEye: index === 3
              })}
            >
              <View className="tab-bar-wrap-item-iconGroup-icon">
                <MyIcon size={28} name={item.iconPath} />
              </View>

              <View className="tab-bar-wrap-item-iconGroup-square"></View>

              <View className="tab-bar-wrap-item-iconGroup-center"></View>

              {index === 0 && <View className="animateLine-help-curve"></View>}

              {index === 1 && (
                <View className="animateTranslate-help">
                  <View className="animateTranslate-help-line">
                    {/*这里应是集成到 icon 中  */}
                  </View>
                  <View className="animateTranslate-help-lineHidden"></View>
                </View>
              )}

              {index === 3 && (
                <View className="animateEye-help-eyes">
                  <View className="animateEye-help-eyes-left animateEye-help-eyes-single"></View>
                  <View className="animateEye-help-eyes-right animateEye-help-eyes-single"></View>
                </View>
              )}

              {!!item.badge && (
                <Text className="tab-bar-badge">{item.badge}</Text>
              )}

              {!!item.dot && <Text className="tab-bar-dot"></Text>}
            </View>
            <Text
              className="tab-bar-wrap-item-text"
              style={{
                color: current == index ? tintColor : color
              }}
            >
              {item.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
