import Taro from "@tarojs/taro";
import { useSelector, useDispatch } from "@tarojs/redux";
import { TabBarState } from "custom-tab-bar/model";
import RealTabBar from "components/tabBar";

export default function CustomTabBar() {
  const { current, initial } = useSelector<any, TabBarState>(state => state.tabBar);
  const dispatch = useDispatch();

  const tabList = [
    {
      text: "首页",
      pagePath: "/pages/index/index",
      iconPath: "home"
    },
    {
      text: "列表",
      pagePath: "/pages/List/index",
      iconPath: "RectangleCopy62"
    },
    {
      text: "分类",
      pagePath: "/pages/Category/index",
      iconPath: "RectangleCopy162",
      badge: 5
    },
    {
      text: "我的",
      pagePath: "/pages/Profile/index",
      iconPath: "RectangleCopy49",
      dot: true
    }
  ];

  return (
    <RealTabBar
      initial={initial}
      current={current}
      backgroundColor="#edeaed"
      color="#999"
      tintColor="#ebc548"
      fixed
      onClick={(current: number) =>
        dispatch({
          type: "tabBar/setCurrent",
          current
        })
      }
      tabList={tabList}
    />
  );
}
