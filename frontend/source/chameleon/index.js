import Vue from 'vue'
import Core from './_Core/'
import { Options, components, filters, routes } from './routes.js'

export default {
    components: [],
    filters: [],
    routes: [],
    load(Products) {
        [{ components, filters, routes }, ...Products].map(({ components, filters, routes }) => {
            for (let name in components) {
                if (this.components.includes(name)) {
                    throw new Error(`全局扩展组件 ${name} 重复定义!`)
                }
                Vue.component(name, components[name])
                this.components.push(name)
            }
            // 注册 Vue 全局 filter
            for (let name in filters) {
                if (this.filters.includes(name) || window[name]) {
                    throw new Error(`全局过滤器 ${name} 重复定义!`)
                }
                Vue.filter(name, filters[name])
                window[name] = filters[name] // 注册后，可在任意地方调用，不受filter的限制
                this.filters.push(name)
            }
            this.routes.push(...routes)
        })
        return this
    },
    start() {
        Vue.use(Core, { ...Options, VueRoutes: this.routes })
    }
}
