import taro, { useState, useEffect } from '@tarojs/taro';
import { UserInfo } from 'pages/Auth/interface';

export default function useUserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

  useEffect(() => {
    taro.getStorage({ key: 'userInfo' }).then(res => {
      setUserInfo(res.data);
    })
  }, []);

  return userInfo;
}
