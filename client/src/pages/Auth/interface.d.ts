export interface UserInfo {
  avatarUrl: string,
  city: string,
  country: string,
  /** 1 男 0 女 */
  gender: 1 | 0,
  language: string,
  nickName: string,
  province: string
}