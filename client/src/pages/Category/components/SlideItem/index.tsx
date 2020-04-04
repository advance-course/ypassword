import Taro, { useState } from "@tarojs/taro";
import {
  View,
  MovableArea,
  MovableView,
  Image,
  Text
} from "@tarojs/components";
import "./index.scss";

export interface ItemProps {
  item: {
    name: String;
    imgUrl: String;
    _id: String;
  },
  delItem,
  editItem
}

export default function MovableDelete(props: ItemProps) {
  const { item, delItem, editItem } = props;
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

  function showDeleteButton() {
    setX(120);
  }

  function hideDeleteButton() {
    setX(0);
  }

  function handleDel() {
    delItem(item);
  }

  function handleEdit () {
    editItem('edit', item)
  }

  return (
    <View className="item">
      <MovableArea className="movable-area" onClick={handleEdit}>
        <MovableView className="movable-view"
          friction={100}
          out-of-bounds={true}
          x={x}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onChange={handleMovableChange}
          direction="horizontal"
        >
          <View className="card-wraper">
            <Image className="img" src={item.imgUrl}></Image>
            <Text className="name">{item.name}</Text>
          </View>
        </MovableView>
      </MovableArea>
      <View className="delete-btn" onClick={handleDel}>
        删除
      </View>
    </View>
  );
}
