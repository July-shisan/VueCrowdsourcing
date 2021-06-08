import('./_Styles/index.scss')
import('./_Styles/bulma.min.css')
import('./_Styles/cover.css')
/**
 *  仅应包含
 *      全局使用的组件
 *  不应包含
 *      页面组件的私有依赖
 */
export const components = {
    Calendar: () => import('./_Components/calendar'),
}
/**
 *  仅应包含
 *      全局使用的过滤器
 *  不应包含
 *      页面组件的私有过滤器
 */
export const filters = {
    // comma(s) { // 1234567 => 1,234,567
    //     return new String(s).replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,')
    // },
}
/**
 *  项目路由配置
 *
 *  meta 配置说明
 *    menu
 *      顶级菜单
        !menu // 不分配菜单
 *    nvai
 *      导航子菜单
        !nvai // 不分配导航
 *    icon
 *      菜单图标样式，标签 <i>
 *    isPublic
 *      游客公开访问
 */
export const routes = [ //
    // ========================================================================
    {
        path: '/',
        component: () => import('./homepage/index.vue'),
        meta: {
            isPublic: true
        }
    },
    {
        path: '/example',
        component: () => import('./example/detailsOfCom.vue'),
        meta: {
            menu: '示例',
            navi: '列表'
        }
    },
    {
        path: '/example/home',
        component: () => import('./example/home.vue'),
        meta: {
            menu: '示例',
            navi: '列表',
            isPublic: true
        }
    },
    {
        path: '/example/:id',
        component: () => import('./example/task_details.vue'),
        meta: {
            menu: '示例',
            navi: '列表',
            isPublic: true
        }
    },
    {
        path: '/example/releaseone',
        component: () => import('./example/releaseOne2One.vue'),
        meta: {
            menu: '示例',
            navi: '列表'
        }
    },
    {
        path: '/example/details-of-one',
        component: () => import('./example/detailsOfOne.vue'),
        meta: {
            menu: '示例',
            navi: '列表'
        }
    },
    {
        path: '/example/releasecom',
        component: () => import('./example/releaseComepetition.vue'),
        meta: {
            menu: '示例',
            navi: '列表'
        }
    },
    {
        path: '/example/details-of-com',
        component: () => import('./example/detailsOfCom.vue'),
        meta: {
            menu: '示例',
            navi: '列表'
        }
    },
    {
        path: '/example/jointask/:id',
        component: () => import('./example/joinTask.vue'),
        meta: {
            menu: '示例',
            navi: '列表'
        }
    },
   
    {
        path: '/example/request',
        component: () => import('./example/request.vue'),
        meta: {
            menu: '示例',
            navi: '接口调用'
        }
    },
    {
        path: '/example/popover',
        component: () => import('./example/popover.vue'),
        meta: {
            menu: '示例',
            navi: '提示窗'
        }
    },
    {
        path: '/example/popwindow',
        component: () => import('./example/popwindow.vue'),
        meta: {
            menu: '示例',
            navi: '模组窗'
        }
    },
    {
        path: '/example/confirmation',
        component: () => import('./example/confirmation.vue'),
        meta: {
            menu: '示例',
            navi: '删除确认'
        }
    },
].map(({ component, meta, ...path }) => ({ ...path, meta, components: { 'coin': component } }))
