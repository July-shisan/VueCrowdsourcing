import('./_Styles/index.scss')

export const Options = {
    el: 'App',
    components: {
        App: () => import('./entry')
    },
    Page404: {
        name: 'PageNotFound',
        path: '/404',
        meta: { isPublic: true },
        component: () => import('./404')
    },
    RouterConfig: {
        mode: 'history',
        base: '/',
        linkActiveClass: 'active',
        linkExactActiveClass: 'active',
    }
}
export { default as components } from './_Components/index.js'
export const filters = {
    // 函数名称直接映射为全局filter名称
    convert(val, array, key, field) {
        return array.reduce((rtn, item) => item[key] == val ? field ? item[field] : item : rtn, undefined)
    },
    KMG(val, k = 1000, suffix = 'B') {
        // 根据百度百科 GB  的换算单位为1000
        //            GiB 的换算单位为1024
        if (isNaN(val)) {
            return val
        }
        const decimal = 100,
            units = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'B', 'N', 'D']
        let i = 0,
            abs = Math.abs(val)
        while (abs >= k && units[i + 1]) {
            i++
            abs /= k
            val /= k
        }
        return Math.round(val * decimal) / decimal + units[i] + suffix
    },
    HMS(secs) {
        if (isNaN(secs) || secs < 0) {
            return secs
        } else {
            let seconds = secs % 60,
                minutes = Math.floor(secs / 60) % 60,
                hours = Math.floor(secs / 3600) % 24,
                days = Math.floor(secs / 86400),
                result = []
            days < 1 || result.push(days + '天')
            hours && result.push(hours + '小时')
            minutes && result.push(minutes + (seconds ? '分' : '分钟'))
            result.push(seconds + '秒')
            return result.slice(0, 2).join('')
        }
    },
    comma(s) {
        return new String(s).replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,')
    },
    isProto(param, type) {
        return Object.prototype.toString.call(param).toLowerCase() === '[object ' + type.toLowerCase() + ']'
    },
    animationTo(callback) {
        (function _run() {
            callback() && requestAnimationFrame(_run)
        })()
    },
    CloneFrom(obj, target) {
        for (let name in obj) {
            obj[name] !== undefined && target[name] !== undefined ? target[name] = obj[name] : null
        }
    },
    ccyear(val) {
        return (val || '').replace('%YEAR%', new Date().getFullYear())
    }
}
export const routes = [ //
    {
        path: '/login/records',
        name: 'self-records',
        component: () => import('./ownlogins'),
        meta: {
            navi: '我的登录日志',
            isPrivate: true
        },
    },
    {
        path: '/system/events',
        component: () => import('./events'),
        meta: {
            menu: '安全',
            navi: '事件审核',
        }
    },
    {
        path: '/system/setting',
        component: () => import('./settings'),
        meta: {
            menu: '安全',
            navi: '安全设置',
        },
    },
    {
        path: '/system/roles',
        component: () => import('./rolelist'),
        meta: {
            menu: '安全',
            navi: '角色管理',
        }
    },
    {
        path: '/system/users',
        component: () => import('./userlist'),
        meta: {
            menu: '安全',
            navi: '用户管理',
        }
    },
    {
        path: '/system/onlines',
        component: () => import('./onlines'),
        meta: {
            menu: '安全',
            navi: '在线用户',
        }
    },
    {
        path: '/system/version',
        component: () => import('./version'),
        meta: {
            menu: '系统',
            navi: '版本信息',
        }
    },
    {
        path: '/log/records',
        component: () => import('./records'),
        meta: {
            menu: '系统',
            navi: '操作日志',
        }
    },
    {
        path: '/log/logins',
        component: () => import('./login-records'),
        meta: {
            menu: '系统',
            navi: '登录日志',
        }
    },
    {
        path: '/log/filelogs',
        component: () => import('./filelogs'),
        meta: {
            menu: '系统',
            navi: '文件日志',
        }
    },
    {
        path: '/product/menueditor',
        component: () => import('./menueditor'),
        meta: {
            menu: '维护',
            navi: '菜单管理',
        }
    },
    {
        path: '/product/basicinfo',
        component: () => import('./basicinfo'),
        meta: {
            menu: '维护',
            navi: '产品信息',
        }
    },
].map(({ component, meta = {}, ...path }) => meta.navi ? { ...path, meta, component } : { ...path, meta, components: { 'core': component } })
