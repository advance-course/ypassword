import Taro, { Config, useEffect, useState, useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtInput, AtList, AtButton, AtSwitch } from "taro-ui";
import "./index.scss";
import { useSelector, useDispatch } from '@tarojs/redux';
import { AccountState } from 'pages/Accounts/model';

export default function ArticleEditor() {
  const router = useRouter()
  const _params = router.params as article.Item;
  const article = useSelector<any, AccountState>(state => state.article);
  const dispatch = useDispatch()
  const [params, setParams] = useState(_params);
  const {title, thumb, url, author, original, time, tag } = params;

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: title || '新增' });
  }, []);

  function save() {
    params.gzhaoId = 'xxx';
    params.gzhaoName = '不知非攻';
    params.gzhaoLogo = 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM6wRRzbU88llribqicWybcMUcibwLicrAticibV2xhdgRGyKN2A/0'
    dispatch({
      type: 'account/addAccount',
      payload: params
    });
  }

  return (
    <View className="container">
      <AtList>
        <AtInput 
          onChange={(v: string) => { setParams({ ...params, title: v }) }} 
          name="title"
          title="文章标题"
          type='text' 
          placeholder='请输入/粘贴标题' 
          value={title} 
        />

        <AtInput
          onChange={(v: string) => {
            setParams({ ...params, url: v })
          }}
          name="url"
          title="文章地址"
          type='text'
          placeholder='请输入/粘贴文章地址'
          value={url}
        />

        <AtInput
          onChange={(v: string) => {
            setParams({ ...params, thumb: v })
          }}
          name="thumb"
          title="缩略图"
          type='text'
          placeholder='请粘贴缩略图地址'
          value={thumb}
        />

        <AtInput
          onChange={(v: string) => {
            setParams({ ...params, author: v })
          }}
          name="author"
          title="作者"
          type='text'
          placeholder='请输入文章作者'
          value={author}
        />

        <AtSwitch
          onChange={(v) => {
            setParams({ ...params, original: v })
          }}
          title='原创' 
          checked={original}
        />

        <AtInput
          onChange={(v: string) => {
            setParams({ ...params, time: v })
          }}
          name="time"
          title="文章发布时间"
          type='text'
          placeholder='请输入文章发布时间'
          value={time}
        />
      </AtList>

      <View className="btn_wrapper">
        <AtButton type="primary" className="add_btn" onClick={save}>确定</AtButton>
      </View>
    </View>
  );
}

ArticleEditor.config = {
  navigationBarTitleText: '新增',
  navigationBarBackgroundColor: '#FFF'
} as Config;
