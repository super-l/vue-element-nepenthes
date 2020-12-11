import { constantRoutes } from '@/router'
import Layout from '@/layout'
import { getMenuNav } from '@/api/menu'
import { removeToken } from '@/utils/auth' // get token from cookie

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

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
      getMenuNav().then((res) => {
        const asyncRouterMap = res.data.menu
        const accessedRoutes = convertRouter(asyncRouterMap)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(function(res) {
        console.log('遇到错误!res:' + res)
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
        const sub_view = childrenMenuItem.url.replace(/^\/*/g, '')

        // console.log(sub_view)
        // sub_view = 'form/index'
        // const diycom = () => import(`@/views/${sub_view}`)
        // const diycom = (resolve) => require(['@/views/' + sub_view], resolve)
        children.push(
          {
            path: '/' + childrenMenuItem.url.replace('/', '-'),
            name: '/' + childrenMenuItem.url.replace('/', '-'),
            // component: (resolve) => require(["@/views/form/index"], resolve),
            // component: r => require.ensure([], () => r(require('@/views/form/index')), 'chunk'),
            // component: (resolve) => require(["@/views/form/index"], resolve),
            component: (resolve) => require(['@/views/' + sub_view], resolve),
            meta: { title: childrenMenuItem.name, icon: 'el-icon-s-help' }
          }
        )
      })
      route.children = children
      accessedRoutes.push(route)
    } else {
      // 处理url
      menuItem.url = menuItem.url.replace(/^\//, '')

      const sub_view = menuItem.url.replace(/^\/*/g, '')
      // console.log(sub_view)
      // sub_view = 'form/index'

      // 生成路由
      accessedRoutes.push(
        {
          path: menuItem.url.replace('/', '-'),
          component: (resolve) => require(['@/views/' + sub_view], resolve),
          name: menuItem.url.replace('/', '-'),
          meta: {
            menuId: menuItem.menuId,
            title: menuItem.name
          }
        }
      )
    }
  })
  accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
  return accessedRoutes
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
