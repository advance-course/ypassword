import Taro, { useEffect } from "@tarojs/taro";
import { View, Label, Image } from "@tarojs/components";
import { AtList, AtListItem } from "taro-ui";
import useUserInfo from "src/hooks/useUserInfo";
import "./index.scss";
import { keys, addStorage, getStorage, removeStorage, paginationStorage } from "../../utils/localStorage";

export default function Profile() {
  const { nickName = "", avatarUrl = "", city = "" } = useUserInfo();

  // useLocalStorage Demo
  useEffect(() => {
    let dataPerPage: Object[];
    let data: Object;
    addStorage({ userName: "test_user", password: "test_pwd" });
    addStorage({ userName: "test_user1", password: "test_pwd1" });
    addStorage({ userName: "test_user2", password: "test_pwd2" });
    addStorage({ userName: "test_user3", password: "test_pwd3" });
    addStorage({ userName: "test_user4", password: "test_pwd4" });
    addStorage({ userName: "test_user5", password: "test_pwd5" });
    addStorage({ userName: "test_user6", password: "test_pwd6" });
    addStorage({ userName: "test_user7", password: "test_pwd7" });
    addStorage({ userName: "test_user8", password: "test_pwd8" });
    addStorage({ userName: "test_user9", password: "test_pwd9" });
    addStorage({ userName: "test_user10", password: "test_pwd10" });
    addStorage({ userName: "test_user11", password: "test_pwd11" });

    // 获取一页的数据
    dataPerPage = paginationStorage(1, 10).list;

    // 获取一条的数据
    data = getStorage(keys[0]);

    // 输出
    console.log(dataPerPage);
    console.log(data);
    
    console.log(`本地存储数据量：${keys.length}`);
    // 删除指定数据（第一页，第0条）
    removeStorage(keys[0]);
    console.log(`本地存储数据量：${keys.length}`);
    
    // 获取并输出
    dataPerPage = paginationStorage(1, 10).list;
    console.log(dataPerPage);
  }, []);

  return (
    <View>
      <View
        className="userInfoContainer"
        onClick={() => Taro.navigateTo({ url: "../UserInfo/index" })}
      >
        <Image src={avatarUrl} className="avatar" />
        <Label className="username">{nickName}</Label>
        <Label className="city">{city}</Label>
      </View>

      <AtList>
        <AtListItem title="类型设置" extraText="x" arrow="right" />
      </AtList>
    </View>
  );
}

Profile.config = {
  navigationBarTitleText: "设置"
};
