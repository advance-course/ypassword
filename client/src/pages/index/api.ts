import http from 'utils/http';

interface Userinfo {
  _id: string,
  avatarUrl?: string,
  city?: string,
  country?: string,
  gender?: string,
  language?: string,
  nickName?: string,
  province?: string
}

export function loginApi()  {
  return http.get<Userinfo>('user/v1/login');
}