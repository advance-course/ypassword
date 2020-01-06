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
  const [map] = useState<Map<string, Object>>(new Map());
  // 上次查询页
  const [lastPage, setLastPage] = useState(0);
  // 总共页数
  const [pageNum, setPageNum]   = useState(Math.floor(map.size / BENCHMARK));

  /*
  @method addLocalStorage
  @param{Props} item 待存储内容
   */
  const addLocalStorage = (item: Props) => {
    const key = uuid(UUID_LENGTH, UUID_RADIX);

    map.set(key, item);
    Taro.setStorageSync(key, JSON.stringify(item));
    setPageNum(Math.floor(map.size / BENCHMARK));
  };

  /*
  @method removeLocalStorage
  @param{number, number} page 删除内容的页数 index 删除内容的索引
  @return{bool | new Error()} 是否删除成功
   */
  const removeLocalStorage = (page: number, index: number) => {
    const exactIndex = (page - 1) * BENCHMARK + index;

    if (page > pageNum || exactIndex >= map.size)
      throw new Error("Index is out of bounds");

    Taro.removeStorage({ key: [...map][exactIndex][0] })
      .then(() => {
        map.delete([...map][exactIndex][0]);
        setPageNum(Math.floor(map.size / BENCHMARK));
        return true;
      })
      .catch(err => {
        throw new Error(err);
      });
  };

  /*
  @method getLocalStorage
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
        i < Math.min(map.size, (page - 1) * BENCHMARK + BENCHMARK);
        i++
      ) {
        result.push(JSON.parse(Taro.getStorageSync([...map][i][0])));
      }
      setLastPage(page);
      return result;
    }

    for (
      let i = (lastPage - 1) * BENCHMARK;
      i < Math.min(map.size, (lastPage - 1) * BENCHMARK + BENCHMARK);
      i++
    ) {
      result.push(JSON.parse(Taro.getStorageSync([...map][i][0])));
    }
    return result;
  };

  return { addLocalStorage, getLocalStorage, removeLocalStorage };
};
