import Taro, { useState } from "@tarojs/taro";
import { View, MovableArea, MovableView } from "@tarojs/components";
import "./index.scss";

export default function MovableDelete() {
  const [x, setX] = useState(0);
  const [startX, setStartX] = useState(0);

  function handleTouchStart(e) {
    setStartX(e.touches[0].pageX);
  }

  function handleTouchEnd(e) {
    if (
      e.changedTouches[0].pageX < startX &&
      e.changedTouches[0].pageX - startX <= -30
    ) {
      showDeleteButton(e);
    } else if (
      e.changedTouches[0].pageX > startX &&
      e.changedTouches[0].pageX - startX < 30
    ) {
      showDeleteButton(e);
    } else {
      hideDeleteButton(e);
    }
  }

  function handleMovableChange(e) {
    if (e.detail.source === "friction") {
      if (e.detail.x < -30) {
        showDeleteButton(e);
      } else {
        hideDeleteButton(e);
      }
    } else if (e.detail.source === "out-of-bounds" && e.detail.x === 0) {
      hideDeleteButton(e);
    }
  }

  function showDeleteButton(e) {
    setX(120);
  }

  function hideDeleteButton(e) {
    setX(0);
  }

  function handleTap(e) {}

  return (
    <View className="item">
      <MovableArea>
        <MovableView
          friction={100}
          out-of-bounds={true}
          x={x}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onChange={handleMovableChange}
          direction="horizontal"
        >
          <View className="card-wraper">
            <View>测试一下啦</View>
          </View>
        </MovableView>
      </MovableArea>
      <View className="delete-btn">删除</View>
    </View>
  );
}
