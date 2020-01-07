import Taro, { useState } from "@tarojs/taro";
import { uuid }           from "../utils/UUIDCreator";

// 每页数据量
const BENCHMARK = 5;
// UUID长度
const UUID_LENGTH = 36;
// UUID进制
const UUID_RADIX = 16;

interface Props {
  userName: string;
  password: string;
}

export const useLocalStorage = () => {
  // 键值对映射
  const [map]       = useState<Map<string, Object>>(new Map());
  // 上次查询页
  let [lastPage]  = useState(1);
  // 总共页数
  let [pageNum]     = useState(Math.ceil(map.size / BENCHMARK));

  /*
  @method addLocalStorage
  @param{Props} item 待存储内容
   */
  const addLocalStorage = (item: Props) => {
    const key = uuid(UUID_LENGTH, UUID_RADIX);

    map.set(key, item);
    Taro.setStorageSync(key, JSON.stringify(item));
    pageNum = Math.ceil(map.size / BENCHMARK);
  };

  /*
  @method removeLocalStorage
  @param{number, number} page 删除内容的页数 index 删除内容的索引
  @return{bool | new Error()} 是否删除成功
   */
  const removeLocalStorage = (page: number, index: number) => {
    const exactIndex = (page - 1) * BENCHMARK + index;

    if (page > pageNum || exactIndex >= map.size) {
      console.log(page);
      console.log(pageNum);
      console.log(exactIndex);
      console.log(map.size);
      throw new Error("Index is out of bounds");
    }

    Taro.removeStorage({ key: [...map][exactIndex][0] })
      .then(() => {
        map.delete([...map][exactIndex][0]);
        pageNum = Math.ceil(map.size / BENCHMARK);
        return true;
      })
      .catch(err => {
        throw new Error(err);
      });
  };

  /*
  @method getLocalStorage 每次获取一页的数据
  @param{number=} page 页数
  @return{Object[] | new Error()} 结果数组或抛出错误
   */
  const getLocalStorage = (page?: number) => {
    const result: Object[] = [];

    if (page) {
      if (page > pageNum)
        throw new Error(`The size of localSotrage is ${pageNum}`);
      for (
        let i = (page - 1) * BENCHMARK;
        i < Math.min(map.size, (page - 1) * BENCHMARK + BENCHMARK - 1);
        i++
      ) {
        // 本地数据不为空，则push入result内
        Taro.getStorageSync([...map][i][0]) ? result.push(JSON.parse(Taro.getStorageSync([...map][i][0]))) : null;
      }
      lastPage = page;
      return result;
    }

    for (
      let i = (lastPage - 1) * BENCHMARK;
      i < Math.min(map.size, (lastPage - 1) * BENCHMARK + BENCHMARK - 1);
      i++
    ) {
      // 本地数据不为空，则push入result内
      Taro.getStorageSync([...map][i][0]) ? result.push(JSON.parse(Taro.getStorageSync([...map][i][0]))) : null;
    }
    return result;
  };

  return { addLocalStorage, getLocalStorage, removeLocalStorage };
};
