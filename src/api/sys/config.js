import request from '@/utils/request'

export function configList(params) {
  return request({
    url: '/sys/config/list',
    method: 'get',
    params: params
  })
}

export function configInfo(id) {
  return request({
    url: '/sys/config/info/' + id,
    method: 'get'
  })
}

export function configDelete(data) {
  return request({
    url: '/sys/config/delete',
    method: 'post',
    data: data
  })
}

export function configSaveOrUpData(type, data) {
  return request({
    url: '/sys/config/' + type,
    method: 'post',
    data: data
  })
}

