import Taro, { useEffect } from "@tarojs/taro";
import { View, Label, Image } from "@tarojs/components";
import { AtList, AtListItem } from "taro-ui";
import useUserInfo from "src/hooks/useUserInfo";
import "./index.scss";
import { useLocalStorage } from "../../hooks/localStorage";

export default function Profile() {
  const { nickName = "", avatarUrl = "", city = "" } = useUserInfo();

  const {
    addLocalStorage,
    getLocalStorage,
    removeLocalStorage
  } = useLocalStorage();

  // useLocalStorage Demo
  useEffect(() => {
    let dataPerPage: Object[];
    addLocalStorage({ userName: "test_user", password: "test_pwd" });
    addLocalStorage({ userName: "test_user1", password: "test_pwd1" });
    addLocalStorage({ userName: "test_user2", password: "test_pwd2" });
    addLocalStorage({ userName: "test_user2", password: "test_pwd2" });
    addLocalStorage({ userName: "test_user2", password: "test_pwd2" });
    addLocalStorage({ userName: "test_user2", password: "test_pwd2" });
    addLocalStorage({ userName: "test_user2", password: "test_pwd2" });
    addLocalStorage({ userName: "test_user2", password: "test_pwd2" });
    addLocalStorage({ userName: "test_user2", password: "test_pwd2" });
    addLocalStorage({ userName: "test_user2", password: "test_pwd2" });
    addLocalStorage({ userName: "test_user2", password: "test_pwd2" });
    addLocalStorage({ userName: "test_user2", password: "test_pwd2" });

    // 获取一页的数据
    dataPerPage = getLocalStorage();

    // 输出
    dataPerPage.map(item => {
      for (let [userName, password] of Object.entries(item)) {
        console.log(`${userName}: ${password}`);
      }
    });
    
    // 删除指定数据（第一页，第0条）
    removeLocalStorage(1, 0);
    
    // 获取并输出
    dataPerPage = getLocalStorage();
    dataPerPage.map(item => {
      for (let [userName, password] of Object.entries(item)) {
        console.log(`${userName}: ${password}`);
      }
    });
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
