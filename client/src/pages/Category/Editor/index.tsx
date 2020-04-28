import Taro, {useState, useRouter} from '@tarojs/taro';
import { View, Canvas } from '@tarojs/components';
import { AtList, AtInput, AtButton, AtListItem } from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';
import './index.scss'
import { CategoryState } from 'pages/Category/model';
import { GlobalState } from 'store/global';
import ImgUtil from "./utils/ImgUtil";
let imgUtil = new ImgUtil();
// import CompressImg from './utils/compress';

const btnText = {
  add: '添加',
  editor: '保存'
}

export default function AddCategory() {
  const dispatch = useDispatch()
  const {params} = useRouter()
  const {type, editorType} = params
  const {current} = useSelector<any, CategoryState>(state => state.category)
  const {userId} = useSelector<any, GlobalState>(state => state.global)
  const [curInfo, setCurinfo]  = useState(current)
  // const canvasRef = useRef<any>(null);
  const [canvasSize, setCanvasSize] = useState({
    width: 0,
    height: 0
  });

  let canvas;
  let canvasId = "compressImgCanvas";

  function btnClickHandler() {
    if (editorType == 'add') {
      dispatch({
        type: 'category/add',
        payload: {type: Number(type), userid: userId, ...curInfo }
      })
    }

    if (editorType == 'editor') {
      dispatch({
        type: 'category/update',
        payload: {
          type: Number(type),
          data: curInfo
        }
      })
    }
  }

  function logoHandler() {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera']
    }).then(async res => {
      Taro.showLoading({title: '上传中...'})
      const file = res.tempFiles[0]
      let path = file.path
      if (file.size > 100 * 1024) {
        const t = file.path.split('.').pop() || ''
        if (!['jpg', 'JPG', 'JPEG', 'jpeg'].includes(t)) {
          Taro.hideLoading()
          Taro.showToast({
            title: `当前图片大小为 ${file.size}B，超过规定大小 100KB，并且格式为 ${t}，无法压缩，请选择 .jpg 或者 .jpeg 格式或者小于50KB的图片进行上传`,
            icon: 'none',
            duration: 6000
          })
          return
        }

        let compressInfo = await compress(path)
        path = compressInfo.filePath
      }
      Taro.cloud.uploadFile({
        filePath: path,
        cloudPath: file.path.split('/').pop() as string
      }).then(res => {
        setCurinfo({...curInfo, imgUrl: res.fileID})
        Taro.hideLoading()
        Taro.showToast({title: '上传成功'})
      }).catch(e => {
        Taro.hideLoading()
        Taro.showToast({
          title: e.message,
          icon: 'none'
        })
      })
    }).catch(e => {
      Taro.showToast({title: '未选择图片', icon: 'none'})
    })
  }

  /**
   * @param path 图片路径
   * @param keepResolutionRatio 是否保持图片原有分辨率
   * @param limitSize 目标大小
   * @param fixed 标准尺寸
   * @param quality 图片质量
   * 需要保持引用一个promise，否则每次递归都返回一个 new promise是全新的,与最开始的那个promise没有任何关系，第一个promise永远不会被resolve。
  */
  async function compress(
    path: string,
    keepResolutionRatio: boolean = false,
    limitSize: number = 50 * 1024,
    fixed: number = 300,
    quality: number = 0.9
  ) {
    return new Promise((resolve) => {
      async function draw (path, keepResolutionRatio, limitSize, fixed, quality) {
        const info = await Taro.getImageInfo({ src: path });
        canvas = canvas || Taro.createCanvasContext(canvasId);
        let newInfo = {
          width: info.width,
          height: info.height
        };

        if (!keepResolutionRatio) {
          newInfo = imgUtil.getUniformScaleInfo(
            info.width,
            info.height,
            quality,
            fixed
          );
        }

        console.log("图片大小", {
          original: { oriW: info.width, oriH: info.height },
          newInfo: { newW: newInfo.width, newH: newInfo.height }
        });

        setCanvasSize({
          width: newInfo.width,
          height: newInfo.height
        });

        setTimeout(() => {
          canvas.drawImage(info.path, 0, 0, newInfo.width, newInfo.height);
          canvas.draw(false, function() {
            // 保持原有宽高通过设置质量进行压缩，不保持原有宽高质量为1
            Taro.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: newInfo.width,
              height: newInfo.height,
              canvasId: canvasId,
              fileType: "jpg",
              quality: keepResolutionRatio ? quality : 1,
              success: async res => {
                const sizeInfo = await Taro.getFileInfo({filePath: res.tempFilePath});
                if (sizeInfo.size > limitSize) {
                  console.log('中间值', sizeInfo.size)
                  // 第一次压缩将非标准图片修改成标准尺寸压缩，之后保持分辨率不变，按质量压缩
                  draw(res.tempFilePath, true);
                } else {
                  console.log('最终值', sizeInfo.size, res.tempFilePath)
                  return resolve({
                    errMsg: 'ok',
                    filePath: res.tempFilePath
                  })
                }
              },
              fail: function() {
                return resolve({
                  errMsg: 'fail',
                  filePath: ''
                })
              },
              complete: function() {

              }
            });
          });
        }, 30)
      }
      draw(path, keepResolutionRatio, limitSize, fixed, quality)
    })
  }

  return (
    <View className="container">
      <AtList>
        <AtInput name="name" title="分类名称" value={curInfo.name}
          onChange={(v: string) => {
            setCurinfo({ ...curInfo, name: v})
          }}
        />
        <AtListItem title="Logo" onClick={logoHandler} extraThumb={curInfo.imgUrl || ''} />

      </AtList>
      <View className="btn-view">
        <AtButton className="btn" type="primary" onClick={btnClickHandler}>{btnText[editorType]}</AtButton>
      </View>
      <Canvas canvas-id="compressImgCanvas" style={'width:' + canvasSize.width + 'px;height:' + canvasSize.height + 'px'}></Canvas>
    </View>
  )
}

AddCategory.config = {
  "navigationBarTitleText": "类别"
}
