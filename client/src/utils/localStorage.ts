import Taro, { useState } from "@tarojs/taro";
import { uuid } from "./UUIDCreator";

// UUID长度
const UUID_LENGTH = 36;
// UUID进制
const UUID_RADIX = 16;

interface Item {
  [key: string]: string | number;
}

// 读取本地存储keys
export const keys: string[] = Taro.getStorageInfoSync()
  ? Taro.getStorageInfoSync().keys
  : [];

// 存入一条数据到本地
export function addStorage(data: Item) {
  const key = uuid(UUID_LENGTH, UUID_RADIX);
  // 如果需要知道是否操作成功，则需要异步设置本地存储
  Taro.setStorageSync(key, JSON.stringify(data));
  keys.push(key);
}

// 根据key删除一条本地缓存数据
export function removeStorage(key: string) {
  // 如果不需要严格判断是否操作成功，则只需要同步的设置本地存储
  Taro.removeStorageSync(key);
  return keys.splice(
    keys.findIndex(item => {
      return item === key;
    }),
    1
  )
    ? true
    : false;
}

// 根据key获取一条数据，返回格式化好的数据
export function getStorage(key: string): Item {
  const index = keys.findIndex(item => {
    return item === key;
  });
  return index === -1 ? {} : JSON.parse(Taro.getStorageSync(keys[index]));
}

export interface Pagination {
  pageSize: number;
  pageNumber: number;
  list: Item[];
}

// 传入 第几页，以及 每页大小，获取一页数据
export function paginationStorage(
  pageNum: number,
  pageSize: number = 10
): Pagination {
  const exactIndex = (pageNum - 1) * pageSize;
  const result: Pagination = {
    pageNumber: pageNum,
    pageSize,
    list: []
  };
  const resultKeys = keys.filter((item, index) => {
    return index >= exactIndex && index < exactIndex + pageSize;
  });

  if (exactIndex >= keys.length) {
    throw new Error("PageNum is more larger than the LocalStorage can page!");
  }
  resultKeys.map(item => {
    result.list.push(JSON.parse(Taro.getStorageSync(item)));
  });

  return result;
}
