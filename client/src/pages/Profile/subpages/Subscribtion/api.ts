import http from 'utils/http';

export interface Subscription {
  _id?: string,
  desc?: string,
  logo?: string,
  name?: string,
  userid?: string,
  // 原创作者名称
  author?: string
}

export function subscriptionAddApi(params: subscribe.Info) {
  return http.post<string>('subscription/v1/add', params)
}

export function subscriptionInfoApi(userid: string) {
  return http.get<subscribe.Info>('subscription/v1/info', {
    userid
  })
}
