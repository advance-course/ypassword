import Taro, {useState} from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtList, AtInput, AtButton } from 'taro-ui';
import LogoSelect from "components/LogoSelect";
import { addCategoryApi } from 'pages/index/api'
export default function Category() {
  const [params, setParams] = useState({
    name: '',
    imgUrl: ''
  })

  function handleSelectImage(select: any) {
    console.log("=========", select);
    setParams({
      ...params,
      imgUrl: select.url
    })
  }

  function addCategory () {
    Taro.showLoading({
      title: '正在提交...',
      mask: true
    })
    addCategoryApi(params).then((res) => {
      console.log('add category result', res)
      Taro.hideLoading();
      Taro.showToast({title: '添加成功', duration: 1000 })
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <View className="container">
      <AtList>
        <AtInput
          name="name"
          title="名称"
          onChange={(v: string) => {
            setParams({...params, name: v})
          }}
        ></AtInput>
        <Image
          className="image"
          src={params.imgUrl}
          mode='widthFix'>
        </Image>
        <LogoSelect title="选择logo" selectText="选择logo按钮" onSelectCallback={handleSelectImage} />
      </AtList>
      <View className="btnView">
        <AtButton className="add_btn" onClick={addCategory}>新增分类</AtButton>
      </View>
    </View>
  )
}

Category.config = {
  "navigationBarTitleText": "类别"
}
