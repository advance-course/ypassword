import Taro, {useState, useRouter} from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtList, AtInput, AtButton, AtListItem } from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';
import './index.scss'
import { CategoryState } from 'pages/Category/model';
import { GlobalState } from 'store/global';

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
        Taro.hideLoading()
        Taro.showToast({
          title: `当前图片大小为 ${file.size}B，超过规定大小 100KB，请上传小于100K的图片`,
          icon: 'none',
          duration: 6000
        })
        return;
        // todo 压缩图片 大图片无法压缩到理想大小，待定
        // Taro.showLoading({
        //   title: '压缩图片...',
        // })
        // const q = Math.ceil((50 * 1024) / file.size * 100)
        // console.log(q)
        // const cps = await Taro.compressImage({ quality: 4, src: path })
        // path = cps.tempFilePath
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
    </View>
  )
}

AddCategory.config = {
  "navigationBarTitleText": "类别"
}
