import Taro, { useState, useEffect } from "@tarojs/taro";
import { AtImagePicker, AtButton, AtFloatLayout } from "taro-ui";
import { View } from "@tarojs/components";
import "./index.scss";

interface File {
  url: string;
  [key: string]: any;
}
interface IProps {
  title?: string;
  selectText?: string;
  onSelectCallback: (select: any) => void;
}
export default function LogoSelect(props: IProps) {
  const [fileList, setFileList] = useState<File[]>([]);
  const [show, setShow] = useState<boolean>(false);
  useEffect(() => {
    if (show === false) {
      setFileList([]);
    }
  }, [show]);
  /**
   * 查询文件列表
   */
  const queryFileList = () => {
    Taro.showLoading({
      title: `正在初始化文件列表...`,
      mask: true
    });
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
  const handleUpload = (
    files: File[],
    operationType: string,
    index: number
  ) => {
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
      title: `正在上传...`,
      mask: true
    });
    const file = files.slice(-1)[0];
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
      title: `正在删除...`,
      mask: true
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
              queryFileList();
              Taro.hideLoading();
            }
          });
      })
      .catch(e => console.error(e));
  };
  async function handleSelect() {
    await queryFileList();
    setShow(true);
  }
  function onImageClick(index: number, file: Object) {
    setShow(false);
    props.onSelectCallback(fileList[index]);
  }
  return (
    <View
      style={{
        padding: "15Px"
      }}
    >
      <AtButton onClick={handleSelect} type="primary">
        {props.selectText || "选择logo"}
      </AtButton>
      <AtFloatLayout
        isOpened={show}
        title={props.title || "选择logo"}
        onClose={() => setShow(false)}
      >
        <AtImagePicker
          multiple={false}
          files={fileList}
          onChange={handleUpload}
          onImageClick={onImageClick}
          length={3} //单行的图片数量> //是否显示添加图
        >
          <AtButton type="primary">上传图片</AtButton>
        </AtImagePicker>
      </AtFloatLayout>
    </View>
  );
}
