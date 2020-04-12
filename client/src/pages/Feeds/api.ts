import http from 'utils/http';
import { Page, PaginationParam } from 'hooks/usePagination/entity';

export function subscriptitonListApi(params: PaginationParam) {
  return http.get<Page<subscribe.Info>>('subscription/v1/list', params)
}
