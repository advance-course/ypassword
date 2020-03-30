import http from 'utils/http';
import { Page, PaginationParam } from 'hooks/usePagination/entity';

export interface WxUserinfo {
  avatarUrl?: string,
  city?: string,
  country?: string,
  gender?: number,
  language?: string,
  nickName?: string,
  province?: string,
}

export interface UserInfo extends WxUserinfo {
  _id: string,
  /** 是否启用加锁 */
  isLock?: boolean,
  /** 是否启用指纹解锁 */
  isFingerprintLock?: boolean,
  /** 是否启用九宫格解锁 */
  isNinecaseLock?: boolean,
  /** 
   * 1： 超级管理员
   * 2： 管理员
   * 3： 普通用户
   * 4： 付费用户
   */
  type: 1 | 2 | 3 | 4,
}

export const userTypeDesc = {
  1: '超级管理员',
  2: '管理员',
  3: '普通用户',
  4: '尊贵VIP'
}

export const userTypes = [
  {
    value: 1,
    desc: '超级管理员',
  },
  {
    value: 2,
    desc: '管理员',
  },
  {
    value: 3,
    desc: '普通用户',
  },
  {
    value: 4,
    desc: '尊贵VIP',
  },
]

/** 用户登录 */
export function loginApi()  {
  return http.get<UserInfo>('user/v1/login');
}

/** 
 * @desc 用户注册 
 * @param {params} WxUserinfo
 * @return userid
 * */
export function registerApi(params: WxUserinfo) {
  return http.post<string>('user/v1/register', params);
}

export function userListApi(params: PaginationParam) {
  return http.get<Page<UserInfo>>('user/v1/list', params);
}

export function userUpdateApi(userid: string, params: UserInfo) {
  return http.get<string>('user/v1/update/info', {
    userid,
    ...params
  })
}