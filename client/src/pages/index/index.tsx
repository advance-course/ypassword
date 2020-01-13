import Taro, { Config, useEffect, useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
// import qs from 'qs';
// import "./index.scss";
// import { useSelector } from '@tarojs/redux';
// import { AccountState } from 'pages/index/model';

// export default function Index() {
//   const accounts = useSelector<any, AccountState>(state => state.account);
//   // const dispatch = useDispatch();
//   useEffect(() => {
//     Taro.getSetting().then(res => {
//       console.log(res);
//       if (!res.authSetting || !res.authSetting['scope.userInfo']) {
//         Taro.navigateTo({ url: '../Auth/index' });
//       }
//     })
//     // Taro.hideTabBar()
//   }, []);

//   return (
//     <View className="container">
//       {accounts.accounts.map((item, i) => (
//         <View
//           onClick={() => Taro.navigateTo({ url: `/pages/Account/Detail/index?${qs.stringify(item)}` })}
//           key={i}
//           className="account_item"
//         >
//           <View className="who_icon">{item.title}</View>
//           <View className="info">
//             <View className="title">{item.title}</View>
//             <View className="username">{item.username}</View>
//           </View>
//         </View>
//       ))}
import { AtForm, AtInput } from 'taro-ui';
// import qs from 'qs';
import "./index.scss";
import CardItem from 'components/CardItem';
import { accounts } from './entity';

export default function Index() {
  const [searchText, setSearchText] = useState();
  const [tick, setTick] = useState(0);
  const [dataList, setDataList] = useState(accounts);

  // useEffect(() => {
  //   Taro.getSetting().then(res => {
  //     console.log(res);
  //     if (!res.authSetting || !res.authSetting['scope.userInfo']) {
  //       Taro.navigateTo({url: '../Auth/index'});
  //     }
  //   })
  // }, []);

  // const a = qs.stringify({a: 1, b: 2});
  // console.log(a);

  useEffect(() => {
    const val = searchText && searchText.trim();
    const list = val ? accounts.filter(item => item.title!.includes(val)) : accounts;
    setDataList(list);
  }, [searchText])

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
        {/* {accounts.map((item, i) => (
          <View
            onClick={() => Taro.navigateTo({ url: `/pages/Account/Detail/index?${qs.stringify(item)}` })}
            key={i}
            className="account_item"
          >
            <View className="who_icon">{item.title}</View>
            <View className="info">
              <View className="title">{item.title}</View>
              <View className="username">{item.username}</View>
            </View>
            <AtIcon value="clock" size="20" color="orange" />
          </View>
        ))} */}

        <CardItem list={dataList} tick={tick} />
      </View>
    </View>
  );
}

Index.config = {
  navigationBarTitleText: '常用',
  navigationBarBackgroundColor: '#187af1',
  navigationBarTextStyle: 'white',
} as Config;