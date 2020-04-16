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
        payload: {type, userid: userId, ...curInfo }
      })
    }

    if (editorType == 'editor') {
      dispatch({
        type: 'category/update',
        payload: {
          type,
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
    }).then(res => {
      Taro.showLoading({title: '上传中...'})
      const file = res.tempFiles[0]
      if (file.size > 100 * 1024) {
        // todo 压缩图片
      }
      
      Taro.cloud.uploadFile({
        filePath: file.path,
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
