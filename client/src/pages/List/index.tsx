import Taro, { useState, useEffect } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";

export default function List() {
  return (
    <View>
      <Text>列表</Text>
    </View>
  );
}

List.config = {
  navigationBarTitleText: "列表"
};
