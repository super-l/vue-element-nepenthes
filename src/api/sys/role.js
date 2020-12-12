import request from '@/utils/request'

export function roleList(params) {
  return request({
    url: '/sys/role/list',
    method: 'get',
    params: params
  })
}

export function roleInfo(id) {
  return request({
    url: '/sys/role/info/' + id,
    method: 'get'
  })
}
export function roleSelect() {
  return request({
    url: '/sys/role/select',
    method: 'get'
  })
}

export function roleDelete(data) {
  return request({
    url: '/sys/role/delete',
    method: 'post',
    data: data
  })
}

export function roleSaveOrUpData(type, data) {
  return request({
    url: '/sys/role/' + type,
    method: 'post',
    data: data
  })
}

