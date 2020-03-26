import http from 'utils/http';

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