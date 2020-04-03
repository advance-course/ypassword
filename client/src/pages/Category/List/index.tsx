import Taro, { useState, useEffect } from "@tarojs/taro";
import { View, Button, Image, Text } from "@tarojs/components";
import { queryCategoryListApi, delCategoryApi } from "../api";
import { UserInfo } from "pages/Auth/interface";
import "./index.scss";
import MyIcon from "components/myIcon";
import MovableItem from '../components/SlideItem/index'

export default function List() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

  useEffect(() => {
    Taro.getStorage({ key: "userInfo" }).then(res => {
      setUserInfo(res.data);
    });
  }, []);

  useEffect(() => {
    if (loading) {
      fetchList().then(res => {
        setLoading(false);
        setList(res.data.data);
      });
    }
  }, [loading]);

  function fetchList() {
    return queryCategoryListApi({
      userID: userInfo._id
    });
  }

  function handleDel(item) {
    delCategoryApi({
      userID: userInfo._id,
      _id: item._id
    }).then(res => {
      if (res.success) {
        Taro.showToast({ title: "删除成功", duration: 1000 });
        setLoading(true);
      }
    });
  }

  function handleEdit(type, item) {
    let url = `/pages/Category/Edit/index?type=${type}`;
    switch (type) {
      case "add":
        break;
      case "edit":
        url = `${url}&_id=${item._id}&userID=${userInfo._id}`;
        break;
    }
    console.log("url", url);
    Taro.navigateTo({
      url: url
    });
  }

  //             onClick={() => handleEdit("edit", item)}
  // onClick={() => handleDel(item)}
  return (
    <View className="container">
      <View className="operate">
        <Button className="btn" onClick={() => handleEdit("add", null)}>
          <MyIcon name="add-circle" size={20} />
        </Button>
      </View>
      <View className="category-list">
        <MovableItem></MovableItem>
      </View>
      {/* {list.map(item => (
        <View key={item._id} className="item">
          <Image src={item.imgUrl} className="img" />
          <Text className="name">{item.name}</Text>
        </View>
      ))} */}
    </View>
  );
}

List.config = {
  navigationBarTitleText: "所有分类"
};
