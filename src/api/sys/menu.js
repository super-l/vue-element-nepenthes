import request from '@/utils/request'

export function menuNav() {
  return request({
    url: '/sys/menu/nav',
    method: 'get',
    params: {
      't': new Date().getTime()
    }
  })
}

export function menuList(params) {
  return request({
    url: '/sys/menu/list',
    method: 'get',
    params: params
  })
}

export function menuInfo(id) {
  return request({
    url: '/sys/menu/info/' + id,
    method: 'get'
  })
}

export function menuSelect() {
  return request({
    url: '/sys/menu/select',
    method: 'get'
  })
}

export function menuDelete(id) {
  return request({
    url: '/sys/menu/delete' + id,
    method: 'post'
  })
}

export function menuSaveOrUpData(type, data) {
  return request({
    url: '/sys/menu/' + type,
    method: 'post',
    data: data
  })
}

