import Taro, { useEffect, useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import qs from 'qs';
import { AtForm, AtInput } from 'taro-ui';
import CardItem from 'components/CardItem';
import { useSelector } from '@tarojs/redux';
import { AccountState } from 'pages/Home/model';
import "./index.scss";

export default function Index() {
  const [searchText, setSearchText] = useState();
  const [tick, setTick] = useState(0);
  const accounts = useSelector<any, AccountState>(state => state.account);

  // console.log(accounts);

  useEffect(() => {
    Taro.getSetting().then(res => {
      // console.log(res);
      if (!res.authSetting || !res.authSetting['scope.userInfo']) {
        Taro.navigateTo({ url: '../Auth/index' });
      }
    })
  }, []);

  // useEffect(() => {
  //   const val = searchText && searchText.trim();
  //   const list = val ? accounts.filter(item => item.title!.includes(val)) : accounts;
  //   setDataList(list);
  // }, [searchText])

  function searchTextChange(val) {
    setSearchText(val);
  }

  function inputFocus () {
    setTick(tick + 1);
  }

  return (
    <View>
      <AtForm>
        <AtInput
          name='search'
          type='text'
          placeholder='请输入'
          value={searchText}
          onFocus={inputFocus}
          onChange={searchTextChange}
        />
      </AtForm>

      <View className="container">
        <CardItem list={accounts.accounts} tick={tick} />
      </View>
    </View>
  );
}
