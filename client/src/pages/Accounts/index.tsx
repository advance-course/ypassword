import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Button, Input } from '@tarojs/components';
import AccountList from './components/List';
import { useSelector, useDispatch } from '@tarojs/redux';
import { AccountState } from './model';
import MyIcon from 'components/myIcon';
import "./index.scss";
import { asyncAccountApi } from 'pages/Accounts/api';

export default function Index() {
  const [searchText, setSearchText] = useState('');
  const account = useSelector<any, AccountState>(state => state.account);
  const dispatch = useDispatch()
  const {uuids, accounts} = account;

  const [syncing, setSyncing] = useState(false)

  const [_uuids, setUUID] = useState(uuids)

  useEffect(() => {
    dispatch({ type: 'account/init' })
  }, [])

  useEffect(() => {
    setUUID(uuids)
  }, [uuids])

  useEffect(() => {
    let _uuids: string[] = []
    uuids.forEach(id => {
      if (accounts[id].title!.indexOf(searchText) > -1) {
        _uuids.push(id)
      }
    })
    setUUID(_uuids)
  }, [searchText])

  function navToAdd() {
    dispatch({
      type: 'account/accountInfo',
      payload: 'reset'
    })
    dispatch({
      type: 'category/selected',
      payload: {}
    })
    Taro.navigateTo({ url: '/pages/Accounts/subpages/Editor/index' })
  }

  function sync() {
    setSyncing(true);
    asyncAccountApi({
      keys: account.uuids,
      account: account.accounts
    }).then(() => {
      Taro.showToast({title: '同步成功', icon: 'success'})
      setSyncing(false)
    }).catch(e => {
      Taro.showToast({ title: e.message, icon: 'none' })
      setSyncing(false)
    })
  }

  return (
    <View className="accounts_container">
      <View className="search_bar">
        <Input className="search" placeholder="输入标题搜索" onInput={(e) => setSearchText(e.detail.value)} />
        <Button className="btn sync" onClick={sync}>
          <MyIcon name="allocat" size={20} spin={syncing} />
        </Button>

        <Button
          className="btn add"
          onClick={navToAdd}
        ><MyIcon name="add-circle" size={20} /></Button>

        {/* <Button
          className="btn category"
          onClick={() => Taro.navigateTo({ url: '/pages/Category/List/index?type=1' })}
        ><MyIcon name="RectangleCopy74" size={20} /></Button> */}
      </View>

      <AccountList ids={_uuids} accounts={accounts} />
    </View>
  );
}
