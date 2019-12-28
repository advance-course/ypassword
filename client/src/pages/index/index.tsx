import Taro, { Config, useEffect, useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtIcon, AtImagePicker, AtButton } from "taro-ui";
import qs from "qs";

import { accounts } from "./entity";
import "./index.scss";

interface File {
  url: string;
  [key: string]: any;
}
export default function Index() {
  useEffect(() => {
    Taro.getSetting().then(res => {
      console.log("setting", res);
      if (!res.authSetting || !res.authSetting["scope.userInfo"]) {
        Taro.navigateTo({ url: "../Auth/index" });
      }
    });
    Taro.showLoading({
      title: `正在初始化文件列表...`
    });
    queryFileList();
  }, []);
  const [fileList, setFileList] = useState<File[]>([]);
  const a = qs.stringify({ a: 1, b: 2 });
  console.log(a);
  const queryFileList = () => {
    Taro.cloud
      .database()
      .collection("file")
      .get()
      .then(res => {
        Taro.hideLoading();
        let fileListTmp = res.data.map(file => {
          return {
            url: file.fileID,
            ...file
          };
        });
        setFileList(fileListTmp);
      })
      .catch(e => console.error(e));
  };
  const toUpload = (files: File[], operationType: string, index: number) => {
    switch (operationType) {
      case "add":
        fileAdd(files);
        break;
      case "remove":
        fileRemove(index);
        break;
      default:
        break;
    }
  };
  const fileAdd = (files: File[]) => {
    Taro.showLoading({
      title: `正在上传...`
    });
    const file = files[0];
    const fileName = file.url.split("/").pop() as string;
    Taro.cloud
      .uploadFile({
        filePath: file.url,
        cloudPath: fileName
      })
      .then(res => {
        Taro.cloud
          .database()
          .collection("file")
          .add({
            data: { fileID: res.fileID, userID: 11 },
            success: () => {
              queryFileList();
              Taro.hideLoading();
            },
            fail: e => console.log(e)
          });
      })
      .catch(e => console.error(e));
  };
  const fileRemove = (index: number) => {
    Taro.showLoading({
      title: `正在删除...`
    });
    const file = fileList[index];
    Taro.cloud
      .deleteFile({
        fileList: [file.url]
      })
      .then(() => {
        Taro.cloud
          .database()
          .collection("file")
          .doc(file._id)
          .remove({
            success: () => {
              setFileList(fileList.slice(index, 1));
              Taro.hideLoading();
            }
          });
      })
      .catch(e => console.error(e));
  };
  return (
    <View className="container">
      {accounts.map((item, i) => (
        <View
          onClick={() =>
            Taro.navigateTo({
              url: `/pages/Account/Detail/index?${qs.stringify(item)}`
            })
          }
          key={i}
          className="account_item"
        >
          <View className="who_icon">{item.title}</View>
          <View className="info">
            <View className="title">{item.title}</View>
            <View className="username">{item.username}</View>
          </View>
          <AtIcon value="clock" size="20" color="orange" />
        </View>
      ))}
      <AtImagePicker
        multiple={false}
        files={fileList}
        onChange={toUpload}
        length={3} //单行的图片数量> //是否显示添加图
      >
        <AtButton type="primary">上传图片</AtButton>
      </AtImagePicker>
    </View>
  );
}

Index.config = {
  navigationBarTitleText: "常用"
} as Config;
