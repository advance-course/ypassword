import Taro, { useEffect, useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtForm, AtInput } from 'taro-ui';
import CardItem from 'components/CardItem';
import { useSelector } from '@tarojs/redux';
import { AccountState } from 'pages/List/model';
import "./index.scss";

export default function Index() {
  const [searchText, setSearchText] = useState();
  const [tick, setTick] = useState(0);
  const accounts = useSelector<any, AccountState>(state => state.account);

  function searchTextChange(val) {
    setSearchText(val);
  }

  function inputFocus() {
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
