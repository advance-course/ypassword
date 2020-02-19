import Taro, {Config} from "@tarojs/taro";
import {View} from "@tarojs/components";
import LogoSelect from "components/LogoSelect";
import "./index.scss";

export default function Layout() {  
  function handleSelectImage(select: any) {
    console.log("=========", select);
  }

  return (
    <View>
      <LogoSelect title="选择logo" selectText="选择logo按钮" onSelectCallback={handleSelectImage} />
    </View>
  );
}

Layout.config = {
  navigationBarTitleText: "新增分类图标",
  navigationBarBackgroundColor: "#ffe100",
  navigationBarTextStyle: "black"
} as Config;
