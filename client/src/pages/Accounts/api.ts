import http from 'utils/http'

export interface SyncParams {
  keys: string[],
  account: {[key: string]: com.Account }
}

export function asyncAccountApi(params: SyncParams) {
  return http.post('accounts/v1/sync', params)
}

export function deleteAccountApi(uuid: string) {
  return http.post('accounts/v1/delete', {
    uuid
  })
}

export function accountsListApi(userid: string) {
  return http.get('accounts/v1/list', {
    userid
  })
}