import request from '@/utils/request'

export function userLogin(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function userLogout() {
  return request({
    url: '/sys/logout',
    method: 'post'
  })
}

export function userList(params) {
  return request({
    url: '/sys/user/list',
    method: 'get',
    params: params
  })
}

export function userInfo() {
  return request({
    url: '/sys/user/info',
    method: 'get'
  })
}

export function userInfo2(id) {
  return request({
    url: '/sys/user/info/' + id,
    method: 'get'
  })
}

export function userDelete(data) {
  return request({
    url: '/sys/user/delete',
    method: 'post',
    data: data
  })
}

export function userSaveOrUpData(type, data) {
  return request({
    url: '/sys/user/' + type,
    method: 'post',
    data: data
  })
}

