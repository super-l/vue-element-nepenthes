import { constantRoutes } from '@/router'
import Layout from '@/layout'
import { menuNav } from '@/api/sys/menu'
import { removeToken } from '@/utils/auth' // get token from cookie
import { isURL } from '@/utils/validate'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {

  /**
   * 自定义动态菜单
   * author: superl[忘忧草安全团队]
   * email:  86717375@qq.com
   */
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      menuNav().then((res) => {
        const asyncRouterMap = res.data.menu
        const accessedRoutes = convertRouter(asyncRouterMap)
        commit('SET_ROUTES', accessedRoutes)

        const permissions = res.data.permissions
        sessionStorage.setItem('permissions', JSON.stringify(permissions || '[]'))

        resolve(accessedRoutes)
      }).catch(function(res) {
        console.log('拉取菜单异常!提示:' + res)
        removeToken()
      })
    })
  }
}

/**
 * 将后台的路由表进行格式化
 * @param {*} asyncRouterMap 远程菜单路由
 * author: superl[忘忧草安全团队]
 * email:  86717375@qq.com
 */
export function convertRouter(asyncRouterMap = []) {
  const accessedRoutes = []

  // 遍历每一条记录

  asyncRouterMap.forEach(menuItem => {
    // 如果存在子菜单
    if (menuItem.list && menuItem.list.length >= 1) {
      const children = []

      const route = {
        path: menuItem.url,
        component: Layout,
        name: menuItem.url,
        meta: { title: menuItem.name, icon: 'el-icon-s-help' },
        children: []
      }

      menuItem.list.forEach(childrenMenuItem => {
        console.log(childrenMenuItem.url)
        if (isURL(childrenMenuItem.url)) {
          children.push(
            {
              path: childrenMenuItem.url,
              redirect: childrenMenuItem.url,
              meta: { title: childrenMenuItem.name, icon: 'el-icon-s-help', iframeUrl: childrenMenuItem.url }
            }
          )
        } else {
          const sub_view = childrenMenuItem.url.replace(/^\/*/g, '')

          children.push(
            {
              path: '/' + childrenMenuItem.url.replace('/', '-'),
              name: '/' + childrenMenuItem.url.replace('/', '-'),
              component: (resolve) => require(['@/views/' + sub_view], resolve),
              meta: { title: childrenMenuItem.name, icon: 'el-icon-s-help' }
            }
          )
        }
      })
      route.children = children
      accessedRoutes.push(route)
    } else {
      const route = {
        path: menuItem.url.replace('/', '-'),
        component: null,
        name: menuItem.url.replace('/', '-'),
        meta: {
          menuId: menuItem.menuId,
          title: menuItem.name
        }
      }

      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuItem.url)) {
        console.log('isurl')
        route.path = `i-${menuItem.menuId}`
        route.name = `i-${menuItem.menuId}`
        route.meta.iframeUrl = menuItem.url
      } else {
        // 处理url
        menuItem.url = menuItem.url.replace(/^\//, '')
        const sub_view = menuItem.url.replace(/^\/*/g, '')
        route.component = (resolve) => require(['@/views/' + sub_view], resolve)
      }

      // 生成路由
      accessedRoutes.push(route)
    }
  })
  console.log(accessedRoutes)
  accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
  return accessedRoutes
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
