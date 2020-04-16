import Taro, { useState, useEffect, useRouter } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import MyIcon from "components/myIcon";
import { useSelector, useDispatch } from '@tarojs/redux';
import { CategoryState } from '../model'
import { GlobalState } from 'store/global';
import "./index.scss";

export default function List() {
  const { list, defList } = useSelector<any, CategoryState>(state => state.category)
  const {userId} = useSelector<any, GlobalState>(state => state.global)
  const router = useRouter()
  const {type} = router.params
  const dispatch = useDispatch()

  let _list: category.Info[] = []
  if (Number(type) == 1) {
    _list = list
  }
  if (Number(type) == 2) {
    _list = defList
  }

  useEffect(() => {
    if (_list.length == 0) {
      dispatch({
        type: 'category/getList',
        payload: {
          userid: userId,
          type: Number(type)
        }
      })
    }
  }, []);

  function nav(editorType: 'add' | 'editor', item?: category.Info) {
    if (editorType == 'add') {
      dispatch({
        type: 'category/current',
        payload: 'reset'
      })
    } else {
      dispatch({
        type: 'category/current',
        payload: item
      })
    }

    Taro.navigateTo({
      url: `/pages/Category/Editor/index?editorType=${editorType}&type=${type}`
    })
  }

  return (
    <View className="container">
      {_list.map((item) => (
        <View className="cat_container" key={item._id} onClick={() => nav('editor', item)}>
          <Image className="image" src={item.imgUrl!} mode="aspectFill" />
          <View className="name">{item.name}</View>
        </View>
      ))}
      <View className="cat_container" onClick={() => nav('add')}>
        <View className="image">
          <MyIcon name="add-circle" size={50} />
        </View>
        <View className="name"></View>
      </View>
    </View>
  );
}

List.config = {
  navigationBarTitleText: "所有分类"
};
