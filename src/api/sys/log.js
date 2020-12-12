import request from '@/utils/request'

export function logList(params) {
  return request({
    url: '/sys/log/list',
    method: 'get',
    params: params
  })
}

