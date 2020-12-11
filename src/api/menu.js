import request from '@/utils/request'

export function getMenuNav() {
  return request({
    url: '/sys/menu/nav',
    method: 'get',
    params: {
      't': new Date().getTime()
    }
  })
}
