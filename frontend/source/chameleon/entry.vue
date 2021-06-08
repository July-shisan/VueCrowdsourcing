<template>
    <section v-if="Helper.AppUseable" class="product-bg custom-bg" :class="['product-bg-'+Product.pin, {flat:Helper.FlatLayout,'full-screen':Helper.FullScreen}]">
        <components :is="HelperComponent" v-if="HelperComponent" :HomePage="DefaultPath" />
        <template v-else>
            <nav class="navbar navbar-dark navbar-expand text-nowrap px-2">
                <router-link :to="DefaultPath" class="navbar-brand" exact tabindex="-1">{{Product.title}}</router-link>
                <template v-if="!Helper.FlatLayout">
                    <div v-for="(menu, id) in UserMenus" :key="id" class="navbar-nav position-relative">
                        <template v-if="menu.child.length > 1">
                            <a class="nav-link dropdown-toggle" :class="{active:menu.active}"><i :class="menu.icon" /> {{menu.menu_id|i18n("menu")}}</a>
                            <div class="dropdown-menu">
                                <router-link v-for="navi in menu.child" :key="navi.path" :to="navi.path" class="dropdown-item" exact>{{navi.navi_id|i18n("navi")}}</router-link>
                            </div>
                        </template>
                        <router-link v-else :to="menu.child[0].path" class="nav-link" :class="{active:menu.active}" exact><i class="fa" :class="menu.icon" /> {{menu.child[0].navi_id|i18n("navi")}}</router-link>
                    </div>
                </template><template v-else />
                <div class="mx-auto" />
                <div class="navbar-nav">
                    <router-link v-for="navi in Meta.OrphanNavi" :key="navi.path" :to="navi.path" class="nav-link" exact><i :class="navi.icon" /> {{navi.navi|i18n("navi")}}</router-link>
                    <a class="nav-link" @click="SwitchLang"><i class="bi bi-translate" /> {{'Switch Language'|i18n(i18n)}}</a>
                </div>
                <div v-if="Profile" class="navbar-nav position-relative">
                    <a v-if="WebShell.enabled" class="nav-link" @click="WebShell.Opening^=true">
                        <template v-if="WebShell.connected">
                            <i class="bi bi-diagram-3-fill text-light" />
                            <sup class="badge rounded-pill bg-primary">{{WebShell.connected}}</sup>
                        </template>
                        <i v-else class="bi bi-diagram-3-fill" />
                    </a><template v-else />
                    <a v-if="Helper.Messages.length" class="nav-link dropdown-toggle"><i class="bi bi-lightbulb-fill text-warning" /></a>
                    <a v-else class="nav-link"><i class="bi bi-lightbulb" /></a>
                    <div class="dropdown-menu end-0" :class="{'d-none':!Helper.Messages.length}">
                        <a v-for="({date, text}, id) in Helper.Messages" :key="id" class="dropdown-item">
                            <small class="font-monospace">{{date|datetime('HH:mm:ss')}}</small>
                            <pre class="d-inline">{{text}}</pre>
                        </a>
                    </div>
                    <a class="nav-link dropdown-toggle"><i class="bi bi-person-circle" /> {{Profile.username}}</a>
                    <div class="dropdown-menu end-0">
                        <a class="dropdown-item" @click="Helper.heartbeat('Sign Out')"><i class="bi bi-power" /> {{'Sign Out'|i18n(i18n)}}</a>
                        <a class="dropdown-item" @click="Profile.ChangingPass=true"><i class="bi bi-key-fill" /> {{'Change Password'|i18n(i18n)}}</a>
                        <a class="dropdown-item" @click="Profile.Localize=true"><i class="bi bi-sliders" /> {{'localize'|i18n(i18n)}}</a>
                        <div class="dropdown-divider" />
                        <a class="dropdown-item" @click="Helper.SwitchLayout"><i class="bi bi-window-sidebar" /> {{'Switch Layout'|i18n(i18n)}}</a>
                        <a class="dropdown-item" data-bs-toggle="tooltip" data-bs-placement="left" title="Press ESC to quit" @click="FullScreen"><i class="bi bi-arrows-fullscreen" /> {{'FullScreen'|i18n(i18n)}}</a>
                        <div class="dropdown-divider" />
                        <div class="dropdown-header position-relative">
                            <div><i class="bi bi-people-fill" /> {{Profile.rolename}}</div>
                            <div class="mt-2">
                                <a id="Downloader">{{'Last Login Info'|i18n(i18n)}}</a>
                                <router-link :to="{name:'self-records'}" class="float-end stretched-link" exact>More...</router-link>
                            </div>
                            <span class="d-block"><i class="bi bi-clock-fill" /> {{Profile.last_login_at|datetime}}</span>
                            <span class="d-block"><i class="bi bi-hdd-network-fill" /> {{Profile.last_login_ip||'-'}}</span>
                        </div>
                    </div>
                </div>
                <div v-else class="navbar-nav">
                    <a class="nav-link" @click="Helper.ActiveLogin^=true"><i class="bi bi-person-circle" /></a>
                </div>
            </nav>
            <div class="layout-wrapper">
                <router-view class="site-contents bg-light" :class="{'rounded-start':Helper.FlatLayout}" :name="RouterName" />
                <div v-if="Helper.FlatLayout" class="flat-menus text-light">
                    <div class="bg-light text-dark mx-1 rounded flex-grow-1">
                        <div v-for="(menu, name) in UserMenus" :key="name">
                            <a class="nav-link" :class="(ActiveMenu==name||menu.active)?'text-primary active':'text-secondary'" @click="ActiveMenu=name"><i class="fa-fw" :class="menu.icon" /> {{menu.menu_id|i18n("menu")}}</a>
                            <router-link v-for="navi in menu.child" :key="navi.path" :to="navi.path" class="dropdown-item" exact>{{navi.navi_id|i18n("navi")}}</router-link>
                        </div>
                    </div>
                    <footer class="menu-footer">
                        <div>Copyright &copy; {{Product.copyright|ccyear}}</div>
                        <div>{{Product.psfn}}</div>
                    </footer>
                </div>
                <footer v-else class="site-footer">
                    <span class="m-auto">
                        <div>Copyright &copy; {{Product.copyright|ccyear}}</div>
                        <div>{{Product.psfn}}</div>
                    </span>
                </footer>
                <WebShell v-if="WebShell.enabled" /><template v-else />
            </div>
        </template>
        <AppMessages />
    </section>
    <section v-else class="p-3">Loading ...</section>
</template>
<script>
    import * as bootstrap from 'bootstrap.js'
    export default {
        components: {
            WebShell: () => import('./helper/site-shell'),
            UserLogin: () => import('./helper/user-login'),
            ChangePass: () => import('./helper/user-passchange'),
            SiteClosed: () => import('./helper/site-closed'),
            AppLicense: () => import('./helper/site-license'),
            AppMessages: () => import('./helper/site-messages'),
            Localize: () => import('./helper/user-localize'),
        },
        data() {
            return {
                ActiveMenu: '',
            }
        },
        computed: {
            i18n: () => i18n,
            Product() {
                return this.Helper.Product
            },
            Profile() {
                return this.Helper.Profile
            },
            HelperComponent() {
                let { Security: { LicenseInvalid, SiteClosed }, ActiveLogin } = this.Helper
                let { Profile: { ChangingPass, ForcePassChange, Localize }, DefaultPath } = this
                return LicenseInvalid && 'AppLicense' ||
                    SiteClosed && 'SiteClosed' ||
                    (ChangingPass || ForcePassChange) && 'ChangePass' ||
                    (ActiveLogin || !DefaultPath) && 'UserLogin' ||
                    Localize && 'Localize' || false
            },
            RouterName() {
                let { pin } = this.Product,
                    [{ components = {} } = {}] = this.$route.matched
                return components[pin] ? pin : 'default'
            },
            UserMenus() {
                let UserMenus = {},
                    Navi = this.Meta.Navi,
                    { navis = [] } = this.Profile || {}
                for (let path in this.Helper.Menus) {
                    let { icon, menu_id, menu, navi_id } = this.Helper.Menus[path]
                    if (navis.includes(navi_id)) {
                        let active = path == Navi
                        UserMenus[menu] = UserMenus[menu] || { menu_id, icon, active, child: [] }
                        path.includes(':') || UserMenus[menu].child.push({ navi_id, path, active })
                        UserMenus[menu].active = UserMenus[menu].active || active
                    }
                }
                return Object.values(UserMenus).filter(item => item.child.length)
            },
            DefaultPath() {
                return this.Meta.OpenAccess[0]
            }
        },
        watch: {
            'HelperComponent': {
                handler(val, old) {
                    let { DefaultPath, Meta: { online } } = this
                    if (DefaultPath && old == 'UserLogin' && !val) {
                        online || this.$router.replace(DefaultPath, noop => {})
                    }
                },
            },
        },
        mounted() {
            new bootstrap.Popover(document.querySelector('body'), {
                selector: '[data-bs-toggle="popover"]',
                trigger: 'hover'
            })
            new bootstrap.Tooltip(document.querySelector('.product-bg'), {
                selector: '[data-bs-toggle="tooltip"]',
                trigger: 'hover'
            })
        },
        methods: {
            FullScreen() {
                (this.Helper.FullScreen ^= true) && document.documentElement.requestFullscreen()
            }
        }
    }
    let i18n = {
        'Switch Language': {
            cn: 'En',
            en: '中'
        },
        'Sign Out': {
            cn: '退出登录'
        },
        'Change Password': {
            cn: '修改密码'
        },
        'localize': {
            en: 'Personal Preferences',
            cn: '个人偏好设置'
        },
        'Switch Layout': {
            cn: '切换页面布局'
        },
        'FullScreen': {
            en: 'Enter Full Screen Mode',
            cn: '进入全屏模式'
        },
        'Last Login Info': {
            cn: '上次登录'
        },
    }
</script>
<style lang="scss">
    section.product-bg {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        overflow: hidden;

        .navbar-expand {
            z-index: 1030;
        }
        .layout-wrapper {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            overflow: auto;
        }
        .site-contents {
            padding: 1rem;
            flex: 1 0;
            display: flex;
            flex-direction: column;
        }
        &.flat {
            .layout-wrapper {
                flex-direction: row-reverse;
            }
            .site-contents {
                overflow: auto;
                >* {
                    flex-shrink: 0;
                }
                &::after {
                    content: "";
                    display: block;
                    height: 1rem;
                    margin-bottom: -1rem;
                    flex-shrink: 0;
                }
            }
            .flat-menus {
                display: flex;
                flex-direction: column;
                flex: 0;
                a {
                    cursor: pointer;
                    white-space: nowrap;
                    min-width: 10rem;
                }
                a.nav-link~a {
                    display: none;
                }
                a.active~a {
                    display: block;
                    padding-left: 2.5rem;
                }
            }
            footer.menu-footer {
                padding: 1rem;
                text-align: center;
            }
        }
        >aside {
            position: fixed;
            top: 0;
            right: 0;
            border: .5rem solid transparent;
            border-radius: .3rem;
            line-height: 1;
            color: white;
            background: rgba(255, 255, 255, .3);
            transform: translate(60%, -60%);
            transition: transform .5s ease;
            z-index: 1040;
            &:hover {
                transform: translate(0, 0);
            }
        }
        &.full-screen {
            >aside {
                background: rgba(0, 0, 0, .3);
            }
            >nav.navbar,
            .flat-menus,
            footer.site-footer {
                display: none;
            }
            .site-contents {
                border-radius: 0 !important;
            }
            #bigscreen {
                padding: 0 !important;
            }
        }
        footer.site-footer {
            flex-shrink: 0;
            border-top: .25rem solid #cecece;
            padding: 1rem;
            background: #f0f0f0;
            text-align: center;
        }
    }
</style>
