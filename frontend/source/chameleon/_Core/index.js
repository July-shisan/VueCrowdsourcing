import socketClient from 'socket.io-client'
import browserAes from 'browserify-aes'
import createHash from 'create-hash'
import VueRouter from 'vue-router'
import buffer from 'buffer'
import Spark from 'spark-md5'
import i18n from './i18n.js'
import Sortable from 'sortablejs'
import WebShell from './webshell.js'
import Validator from './validator.js'
import Directives from './directives.js'
import FingerPrint from './fingerprint2.min.js'

window.SparkMD5 = Spark
window.Sortable = Sortable
window.Buffer = buffer.Buffer
const Console = console,
    [ma, mb] = [4, 5],
    translate = i18n.translate.bind(i18n),
    mrand = (a, b) => Math.random().toString(a).substr(b),
    { createCipheriv: cv, createDecipheriv: dv } = browserAes,
    { parse: jp, stringify: js } = JSON

let Helper = {
    ticker: 3e5, // 5 minutes
    isReady: false,
    AppServer: AppServer,
    HeartBeating: Date.now(),
    Meta() {
        const OrphanNavi = [],
            OpenAccess = [],
            { Helper: { Profile, Menus, Singleton }, $route } = this,
            { fullPath: href, matched: [{ path: navi } = {}], Navi = navi || href } = $route,
            { isPublic, navi_id } = Menus[Navi] || {},
            isPrivate = Profile && Profile.navis.includes(navi_id)
        for (let path in Singleton) {
            let { isPublic, isPrivate, navi, icon } = Singleton[path]
            isPublic || Profile && isPrivate ? OpenAccess.push(path) : null
            isPublic && navi && OrphanNavi.push({ path, navi, icon })
        }
        return { href, navi, Navi, online: isPublic || isPrivate || OpenAccess.includes(Navi), OpenAccess: OpenAccess.sort(), OrphanNavi }
    },
    attach(name, callback) {
        isProto(callback, 'function') ? this[name] = callback : null
    },
    detach(name) {
        delete this[name]
    },
    emit(name, ...args) {
        this[name] && this[name](...args)
    },
    fire(event, req, cb) {
        if (this.Vue) {
            let { href, navi } = this.Meta.call(this.Vue)
            req = { href, navi, ...req }
        }
        this.SocketServer.emit(event, this.Meta.encode(req), res => cb(this.Meta.decode(res)))
    },
    download(fileinfo) {
        if (!fileinfo) {
            return
        }
        const Mb = 1024 * 1024,
            { Helper } = this.Vue,
            xhr = new XMLHttpRequest(),
            issued = Date.now().toString(36),
            DomNode = document.querySelector('#Downloader'),
            { filename, tmp_name, keep } = fileinfo
        fileinfo = '?fileinfo=' + [issued, this.Meta.encode([filename, tmp_name, keep], issued), this.SocketServer.id].join('.')
        xhr.open('GET', Helper.Product.AttachUrl + fileinfo, true)
        Object.assign(xhr, {
            responseType: 'blob',
            onprogress: ({ lengthComputable, loaded, total }) => {
                if (lengthComputable && total >= 5 * Mb) {
                    Helper.TipProgress = loaded / total
                }
            },
            onload: noop => {
                if (xhr.status !== 200) {
                    Helper.TipMessage = 'File Not Found'
                    xhr.abort()
                    return
                }
                DomNode.download = filename
                DomNode.href = URL.createObjectURL(new Blob([xhr.response]))
                DomNode.click()
            },
            onerror: () => {
                Helper.TipProgress = 0
                xhr.abort()
            },
            onloadend: () => {
                DomNode.href = ''
                DomNode.download = ''
                setTimeout(noop => {
                    Helper.TipProgress = 0
                }, Helper.TipProgress ? 1500 : 10) // 没啥道理，测试出来的理论值
            }
        })
        xhr.send()
    }
}

export default {
    install(Vue, options) {
        Vue.use(VueRouter)
        Vue.config.productionTip = false
        Vue.config.devtools = false
        let Observe = Vue.observable,
            VueHelper = Observe({
                Connected: false,
                AppUseable: false,
                FullScreen: false,
                FlatLayout: false,

                ActiveLogin: false,
                Profile: false,
                Security: {},
                Rules: {},
                Menus: {},

                Messages: [],
                TipAuditing: false,
                TipMessage: false,
                TipProgress: 0,
                TipLoading: 0,
            }),
            tipAlert = text => {
                VueHelper.Messages = [{ date: Date.now(), text }, ...VueHelper.Messages].splice(0, 10)
            },
            scrollTop = function() {
                let wrapper = document.querySelector('.layout-wrapper')
                wrapper ? wrapper.scrollTo(0, 0) : null
            },
            SwitchLang = function() {
                i18n.lang = i18n.lang == 'cn' ? 'en' : 'cn'
                VueHelper.AppUseable = false
                Helper.Vue.$nextTick(noop => {
                    VueHelper.AppUseable = true
                })
            },
            Private = {
                lang: () => i18n.lang,
                Observe: () => Observe,
                translate: () => translate,
                validator: () => Validator,
                request: () => this.request,
                WebShell: () => WebShell,
                Helper: () => VueHelper,
                Alert: () => tipAlert,
                scrollTop: () => scrollTop,
                SwitchLang: () => SwitchLang,
                Meta: Helper.Meta
            },
            heartbeat = function(param) {
                if (!this.Connected || param instanceof MouseEvent && Helper.HeartBeating + Helper.ticker > Date.now()) {
                    return
                }
                Helper.HeartBeating = Date.now()
                const token = this.Storage.token,
                    reason = isProto(param, 'String') ? param : false,
                    callback = isProto(param, 'Function') ? param : function() {}
                if (token) {
                    Helper.fire('heartbeat', { error: reason, token }, result => {
                        const { error = reason, token, ...profile } = result || {}
                        if (error) {
                            this.TipMessage = translate(error, 'heartbeat')
                            this.Storage.removeItem('token')
                            this.Profile = false
                            Helper.Vue ? this.ActiveLogin = !Helper.Vue.Meta.online : null
                            WebShell.destroy()
                        } else {
                            token && Object.assign(this.Storage, { token })
                            const Profile = { ForcePassChange: false, ChangingPass: false, Localize: false, ...profile }
                            if (profile.uuid && js(this.Profile) != js(Profile)) {
                                this.Profile = Profile
                            }
                        }
                        callback()
                    })
                } else {
                    token != undefined && this.Storage.removeItem('token')
                    this.Profile = false
                    callback()
                }
            }.bind(VueHelper),
            freshdata = function({ Product, Menus, Rules, Security }, callback) {
                const Singleton = {}
                let menus = {},
                    navis = {}
                for (let name in Menus) {
                    let { menu_id, navi_id, menu, menu_en, navi, navi_en } = Menus[name]
                    menus[menu_id] = { en: menu_en, cn: menu }
                    navis[navi_id] = { en: navi_en, cn: navi }
                }
                i18n.mixin('menu', menus, true)
                i18n.mixin('navi', navis, true)
                options.VueRoutes.map(({ meta, path }) => Menus[path] ? Menus[path] = { ...meta, ...Menus[path], exist: true } : Singleton[path] = meta)
                Validator.inject({ FullRefused: Rules.black_words.split('\n') })
                WebShell.inject({ enabled: Security.Features.webshell === true })
                Product.Revision = Revision
                Product.AttachUrl = Helper.AppServer + Product.AttachUrl
                document.title = (DevMode ? '[Dev] ' : '') + Product.title
                Object.assign(this, { Connected: true, AppUseable: true, Product, Menus, Singleton, Rules, Security })
                heartbeat(callback)
            }.bind(VueHelper),
            SwitchLayout = function() {
                this.FlatLayout ^= true
                this.Storage.layout = this.FlatLayout ? 'flat' : ''
            }.bind(VueHelper),
            protect = function() {
                throw new Error('Private Property')
            }
        Vue.filter('i18n', translate)
        Vue.filter('datetime', i18n.datetime.bind(i18n))
        Object.keys(Private).map(name => Object.defineProperty(Vue.prototype, name, { get: Private[name], set: protect }))
        Object.assign(VueHelper, { heartbeat, SwitchLayout, Storage: localStorage, FlatLayout: localStorage.layout == 'flat' })
        Helper.attach('heartbeat', cb => Helper.fire('freshdata', { issued: Date.now() }, res => freshdata(res, cb)))
        Validator.inject({ Observe, translate })
        Vue.use(Directives, { VueHelper, WebShell })
        WebShell.inject({ Server: Helper, Observe, mrand })
        addEventListener('mousemove', heartbeat)
        FingerPrint.get(items => this.Serve(Vue, VueHelper, items.filter(({ key, value }) => !key.includes('enRes') && value), options))
    },
    Serve(Vue, VueHelper, fingers, { RouterConfig, VueRoutes, Page404, ...VueConfig }) {
        let tmz = new Date().getTimezoneOffset(),
            cipher = fingers[mrand(10, 2) % fingers.length],
            { hash, encode, decode, token = mrand(35, 2), finger = hash(fingers) } = this,
            WatchDog = this.RouterAuthHook.bind(VueHelper)
        Helper.SocketServer = socketClient(Helper.AppServer, {
            transports: ['websocket'],
            reconnectionAttempts: 5,
            path: '/chameleon'
        }).on('connect', function() {
            Object.assign(Helper.Meta, { hash, encode, decode, token, cipher, finger })
            this.emit('connected', Helper.Meta.encode({ tmz, issued: Date.now(), token, cipher, finger }, this.id, fingers[0].value), handshake => {
                const { Product, ServiceMode, ...secure } = Helper.Meta.decode(handshake) || {}, router = new VueRouter({ ...RouterConfig,
                    routes: [...VueRoutes.reduce((rtn, { meta: noop, ...item }) => {
                        return item.component || item.components[Product.pin] || ServiceMode && item.components.core ? [...rtn, item] : rtn
                    }, []), Page404, { path: '*', redirect: Page404.path }]
                })
                router.beforeEach(WatchDog)
                Object.assign(Helper.Meta, secure)
                Helper.emit('heartbeat', noop => {
                    Helper.isReady = true
                    Helper.Vue ? null : Helper.Vue = new Vue({ ...VueConfig, router })
                })
            })
            // console.trace(this.io.engine.id, this.id)
        }).on('reconnect_failed', function() {
            Console.warn('Server Down ...\nNext reconnection attempt within 3 minutes')
            setTimeout(noop => this.open(), 180 * 1e3)
        }).on('disconnect', function() {
            Object.assign(VueHelper, { Connected: false, TipLoading: 0 })
            WebShell.destroy()
        }).on('webshell', WebShell.onData.bind(WebShell)).on('broadcasting', Helper.emit.bind(Helper))
    },
    RouterAuthHook(to, from, next) {
        const { token, ...query } = to.query, { online } = Helper.Meta.call({ Helper: this, $route: to })
        if (!this.Connected || !Helper.isReady) {
            setTimeout(next, !this.Connected && 200 || !Helper.isReady && 50, to)
        } else if (token) {
            Object.assign(this.Storage, { token })
            this.heartbeat(noop => next({ ...to, query }))
        } else if (to.name == 'PageNotFound' || online) {
            next()
        } else {
            next({ ...to, query, name: 'PageNotFound' })
        }
    },
    hash(text, c, d) {
        let result = createHash('sha256').update(js(text)).digest('base64')
        return c && d ? result.substr(result.split('').reduce((a, b) => a * b.charCodeAt() % c, 1), d) : result
    },
    encode(plaindata, token = this.token, cipher = this.cipher) {
        try {
            const e = cv('aes-256-cbc', this.hash(token, 1 << ma, 1 << mb), this.hash(cipher, 1 << mb, 1 << ma))
            return (e.update(js(plaindata), 'utf8', 'base64') + e.final('base64')).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '~')
        } catch (e) {
            return false
        }
    },
    decode(encrypted, token = this.token, cipher = this.cipher) {
        try {
            const d = dv('aes-256-cbc', this.hash(token, 1 << ma, 1 << mb), this.hash(cipher, 1 << mb, 1 << ma))
            return jp(d.update(encrypted, 'base64', 'utf8') + d.final('utf8'))
        } catch (e) {
            return false
        }
    },
    request(apiName, params, method = '') {
        method = ['GET', 'PUT', 'DELETE'].includes(method.toUpperCase()) ? method : 'POST'
        let listener, counter = !this.HideLoading,
            noop = () => {},
            _resolve = noop,
            _finally = noop,
            _reject = error => !Console.error(error),
            Reaction = {
                resolve(callback) {
                    _resolve = isProto(callback, 'function') ? callback : noop
                    return this
                },
                reject(callback) {
                    _reject = isProto(callback, 'function') ? callback : noop
                    return this
                },
                finally(callback, delay) {
                    if (!isProto(callback, 'function')) {
                        _finally = noop
                    } else if (!isProto(delay, 'Number')) {
                        _finally = callback
                    } else if (delay > 0) {
                        _finally = () => setTimeout(callback, delay)
                    }
                }
            },
            Resolve = (data) => {
                _resolve(data)
                return true
            },
            Reject = (message, dict, body, href) => {
                /**
                 * reject 参数说明：
                 * reject === false 禁止弹窗提示错误 否则启用错误弹窗提示
                 * Object.prototype.toString.call(reject) == "[object Function]" 依据返回值按以上逻辑处理
                 * console.[log|warn|error] 支持console回显但不弹窗提示错误
                 */
                if (message) {
                    message = i18n.translate(message, dict)
                    this.Helper.TipMessage = _reject(message, body, href) && message
                }
                return !!message
            },
            Finally = () => {
                listener && Helper.detach(listener)
                _finally()
            }
        if (!this.Helper.Connected) {
            Reject('Cannot establish connection to the server !!!')
            Finally()
        } else if (!isProto(apiName, 'String') || !apiName) {
            Reject('The interface address is invalid, please check again.')
            Finally()
        } else if (!isProto(params, 'Object')) {
            Reject('The parameter format is incorrect. Please use the Object format instead.')
            Finally()
        } else {
            this.Helper.TipLoading += counter
            const request = { method, apiName, params }
            if (params.listener) {
                listener = mrand(36, -10)
                Helper.attach(listener, params.listener)
                params.listener = listener
            }
            Helper.fire('transport', request, response => {
                let { auditing, data, attachment, success, error } = response || {}
                this.Helper.TipLoading -= counter
                if (success) {
                    this.Helper.TipAuditing = auditing
                    Helper.download(attachment)
                    Resolve(data)
                } else {
                    if (isProto(error, 'Object')) {
                        let { title, body, href } = error
                        title != 'Session Expired !!' || this.Helper.heartbeat(title)
                        this.Alert(title)
                        Reject(title || 'The returned data format is incorrect and cannot be parsed!', 'errors', body, href)
                    } else {
                        error != 'Session Expired !!' || this.Helper.heartbeat(error)
                        this.Alert(error)
                        Reject(error || 'The returned data format is incorrect and cannot be parsed!', 'errors')
                    }
                }
                Finally()
            })
        }
        return Reaction
    }
}
