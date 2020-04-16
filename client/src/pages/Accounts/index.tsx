import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Button, Input } from '@tarojs/components';
import AccountList from './components/List';
import { useSelector, useDispatch } from '@tarojs/redux';
import { AccountState } from './model';
import MyIcon from 'components/myIcon';
import "./index.scss";

export default function Index() {
  const [searchText, setSearchText] = useState('');
  const account = useSelector<any, AccountState>(state => state.account);
  const dispatch = useDispatch()
  const {uuids, accounts} = account;

  useEffect(() => {
    dispatch({ type: 'account/init' })
  }, [])

  return (
    <View className="accounts_container">
      <View className="search_bar">
        <Input className="search" placeholder="输入标题搜索" onInput={(e) => setSearchText(e.detail.value)} />
        <Button className="btn async" onClick={() => Taro.navigateTo({url: '/pages/Accounts/subpages/Editor/index'})}>
          <MyIcon name="allocat" size={20} />
        </Button>

        <Button
          className="btn add"
          onClick={() => Taro.navigateTo({url: '/pages/Accounts/subpages/Editor/index'})}
        ><MyIcon name="add-circle" size={20} /></Button>

        <Button
          className="btn category"
          onClick={() => Taro.navigateTo({ url: '/pages/Category/List/index?type=1' })}
        ><MyIcon name="RectangleCopy74" size={20} /></Button>
      </View>

      <AccountList ids={uuids} accounts={accounts} />
    </View>
  );
}
