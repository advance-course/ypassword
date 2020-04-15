import Taro, { useState, useEffect } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { UserInfo } from "pages/Auth/interface";
import "./index.scss";
import MyIcon from "components/myIcon";
import SlideItem from '../components/SlideItem/index'
import { useSelector, useDispatch } from '@tarojs/redux';
import { CategoryState } from '../model'
export default function List() {
  const { list } = useSelector<any, CategoryState>(state => {
    return state.category
  })

  const dispatch = useDispatch()

  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

  const _params = this.$router.params

  useEffect(() => {
    Taro.getStorage({ key: "userInfo" }).then(res => {
      setUserInfo(res.data);
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'category/getList',
      payload: {
        userID: userInfo._id
      }
    })
  }, []);

  function handleDel(item) {
    dispatch({
      type: 'category/del',
      payload: {
        userID: userInfo._id,
        _id: item._id
      }
    })
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

  function handleClick (type, item) {
    if (_params && _params.type && _params.type === 'choose') {
      Taro.navigateBack({ category: item._id })
    } else {
      handleEdit(type, item)
    }
  }

  return (
    <View className="container">
      <View className="operate">
        <Button className="btn" onClick={() => handleEdit("add", null)}>
          <MyIcon name="add-circle" size={20} />
        </Button>
      </View>
      <View className="category-list">
        {list.map((item, index) => (
          <SlideItem
          key={item._id}
          item={item}
          delItem={handleDel}
          clickItem={handleClick}
          ></SlideItem>
        ))}
      </View>
    </View>
  );
}

List.config = {
  navigationBarTitleText: "所有分类"
};
