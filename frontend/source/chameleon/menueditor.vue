<template>
    <div>
        <Navigation>
            <small class="text-muted mr-auto">{{'tip-click'|i18n(i18n)}}</small>
            <span class="badge bg-warning text-dark">{{'tip-changed'|i18n(i18n)}}</span>
            <button class="btn btn-sm btn-warning ms-2" @click="ModifyMenu({})"><i class="bi bi-navicon" /> {{'Create Menu'|i18n(i18n)}}</button>
            <button class="btn btn-sm btn-outline-success" :class="{active:OrderChanged,disabled:!OrderChanged}" @click="SaveOrder"><i class="bi bi-shuffle" /> {{'Save Order'|i18n(i18n)}}</button>
        </Navigation>
        <div class="d-flex flex-nowrap flex-fill">
            <div v-if="OrphanNavi.length">
                <div class="card bg-warning me-3">
                    <div class="card-header text-dark">{{'tip-unregister'|i18n(i18n)}}</div>
                    <div class="list-group list-group-flush">
                        <div v-for="item in OrphanNavi" :key="item.path" class="list-group-item" @dblclick="ModifyNavi(item)">{{item.path}}</div>
                    </div>
                </div>
            </div><template v-else />
            <div id="MenuSorter">
                <div v-for="Menu in SiteMenus" :key="Menu.id">
                    <dl class="card">
                        <dt class="card-header" @dblclick="ModifyMenu(Menu)">
                            <i :class="Menu.icon||'bi bi-patch-question text-danger'" /> {{Menu.id|i18n("menu")}}
                            <span v-if="!Menu.child.length" role="button" class="close text-danger" @click="RemoveMenu(Menu)"><small>&times;</small></span>
                        </dt>
                        <dd class="list-group list-group-flush">
                            <div v-for="Navi in SiteNavis[Menu.id]" :key="Navi.id" class="list-group-item" :class="{'text-black-50':Navi.path.includes(':')}" @dblclick="ModifyNavi(Navi)">
                                {{Navi.id|i18n("navi")}}
                                <i v-if="Navi.path.includes(':')" class="bi bi-eye-slash" /><template v-else />
                                <sup v-if="!Navi.exist" role="button" class="close text-danger" @click="RemoveNavi(Navi)"><small>&times;</small></sup>
                                <sup v-else-if="Navi._n!=Navi.navi" class="badge bg-dark text-light">定义不符</sup>
                                <template v-else />
                            </div>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
        <PopWindow v-if="Dialogs.ModifyMenu" v-escape="CloseDialogs" :dismiss="CloseDialogs" :btnConfig="{checker:validator}" :Done="Dialogs.ModifyMenu">
            <template #title>{{ActionProto.id?'Modify Menu':'Create Menu'|i18n(i18n)}}</template>
            <template #button>{{ActionProto.id?'Modify':'Create'|i18n(i18n)}}</template>
            <div class="row">
                <div class="col-auto display-4 px-3">
                    <i class="mt-3" :class="ActionProto.icon||'bi bi-patch-question text-warning'" />
                </div>
                <div class="col">
                    <label class="form-label">{{'icon'|i18n(i18n)}}</label>
                    <input v-model="ActionProto.icon" class="form-control" :class="{'is-invalid':validator.tips.icon}" @blur="validator.check('icon')">
                    <span class="invalid-feedback">{{validator.tips.icon}}</span>
                </div>
                <div class="col">
                    <label class="form-label">中文菜单</label>
                    <input v-model="ActionProto.menu" class="form-control" :class="{'is-invalid':validator.tips.menu}" @blur="validator.check('menu')">
                    <span class="invalid-feedback">{{validator.tips.menu}}</span>
                </div>
                <div class="col">
                    <label class="form-label">English Menu</label>
                    <input v-model="ActionProto.en" class="form-control" :class="{'is-invalid':validator.tips.en}" @blur="validator.check('en')">
                    <span class="invalid-feedback">{{validator.tips.en}}</span>
                </div>
            </div>
        </PopWindow>
        <PopWindow v-else-if="Dialogs.ModifyNavi" v-escape="CloseDialogs" :dismiss="CloseDialogs" :btnConfig="{checker:validator}" :Done="Dialogs.ModifyNavi">
            <template #title>{{ActionProto.id?'Modify Navi':'Create Navi'|i18n(i18n)}}</template>
            <template #button>{{ActionProto.id?'Modify':'Create'|i18n(i18n)}}</template>
            <div class="mb-3">
                <label class="form-label">{{'menu'|i18n(i18n)}}</label>
                <select v-model="ActionProto.menu_id" class="form-select">
                    <option v-for="item in SiteMenus" :key="item.id" :value="item.id">{{item.menu|i18n('menu')}}</option>
                </select>
                <div class="form-control d-none" :class="{'is-invalid':validator.tips.menu_id}" />
                <span class="invalid-feedback">{{validator.tips.menu_id}}</span>
            </div>
            <div class="row">
                <div class="col">
                    <label class="form-label">{{'path'|i18n(i18n)}}</label>
                    <input v-model="ActionProto.path" class="form-control" :class="{'is-invalid':validator.tips.path}" @blur="validator.check('path')">
                    <span class="invalid-feedback">{{validator.tips.path}}</span>
                </div>
                <div class="col">
                    <label class="form-label">中文导航</label>
                    <input v-model="ActionProto.navi" class="form-control" :class="{'is-invalid':validator.tips.navi}" @blur="validator.check('navi')">
                    <span class="invalid-feedback">{{validator.tips.navi}}</span>
                </div>
                <div class="col">
                    <label class="form-label">English Navi</label>
                    <input v-model="ActionProto.en" class="form-control" :class="{'is-invalid':validator.tips.en}" @blur="validator.check('en')">
                    <span class="invalid-feedback">{{validator.tips.en}}</span>
                </div>
            </div>
        </PopWindow>
        <Confirmation v-else-if="Dialogs.RemoveMenu" :dismiss="CloseDialogs" :Done="Dialogs.RemoveMenu" :VerifyPassword="true">
            {{'menu'|i18n(i18n)}} <span class="text-primary">{{ActionProto.menu}}</span> {{'tip-remove'|i18n(i18n)}}
        </Confirmation>
        <Confirmation v-else-if="Dialogs.RemoveNavi" :dismiss="CloseDialogs" :Done="Dialogs.RemoveNavi" :VerifyPassword="true">
            {{'navi'|i18n(i18n)}} <span class="text-primary">{{ActionProto.navi}}</span> {{'tip-remove'|i18n(i18n)}}
        </Confirmation><template v-else />
    </div>
</template>
<script>
    export default {
        data() {
            return {
                MenusOrder: [],
                NavisOrder: [],
                SiteMenus: [],
                SiteNavis: {},

                ActionProto: false,
                Dialogs: {
                    ModifyMenu: false,
                    RemoveMenu: false,
                    ModifyNavi: false,
                    RemoveNavi: false,
                }
            }
        },
        computed: {
            i18n: () => i18n,
            OrderChanged() {
                let MO = [],
                    { stringify: js } = JSON,
                    { SiteMenus: sm, MenusOrder: mo, NavisOrder: no } = this
                let NO = sm.map(({ id, child }) => MO.push(id) && [id, child])
                return js(MO) != js(mo) || js(NO) != js(no)
            },
            OrphanNavi() {
                let report = [],
                    { Singleton } = this.Helper
                for (let path in Singleton) {
                    let { menu, navi, isPrivate } = Singleton[path]
                    this.Meta.OpenAccess.includes(path) || isPrivate || navi && report.push({ path, menu, navi })
                }
                return report
            }
        },
        created() {
            this.RefreshContents()
        },
        methods: {
            RefreshContents() {
                this.CloseDialogs()
                this.request('Service/ListMenuNavis', {}).resolve(success => {
                    let SiteMenus = [],
                        SiteNavis = {},
                        { Menus: Current } = this.Helper
                    success.menus.map(item => {
                        SiteMenus.push({ ...item, child: [] })
                        SiteNavis[item.id] = {}
                    })
                    success.navis.map(({ menu_id, navi, path, ...item }) => {
                        let [Menu] = SiteMenus.filter(item => item.id == menu_id)
                        Menu.child.push(item.id)
                        SiteNavis[menu_id][path] = { menu_id, path, ...item, navi }
                    })
                    for (let path in Current) {
                        let { menu_id, navi, exist } = Current[path],
                            Navi = SiteNavis[menu_id][path]
                        Object.assign((Navi || {}), { exist, _n: navi })
                    }
                    this.SiteMenus = SiteMenus
                    this.MenusOrder = SiteMenus.map(({ id }) => id)
                    this.SiteNavis = SiteNavis
                    this.NavisOrder = SiteMenus.map(item => ([item.id, [...item.child]]))
                }).finally(noop => {
                    this.HandleSorter()
                }, 100)
            },
            HandleSorter() {
                let Menus = this.$el.querySelector('#MenuSorter')
                new Sortable(Menus, {
                    group: 'menu',
                    ghostClass: 'ghost',
                    handle: '.card-header',
                    animation: 200,
                    onSort: ({ oldIndex: o, newIndex: n }) => {
                        let m = this.MenusOrder
                        m.splice(n, 0, ...m.splice(o, 1))
                    }
                })
                Array.from(Menus.querySelectorAll('.list-group')).map((Navi, i) => new Sortable(Navi, {
                    group: 'navi',
                    ghostClass: 'ghost',
                    animation: 200,
                    onStart(e) {
                        e.item.i = i
                    },
                    onAdd: ({ oldIndex: o, newIndex: n, item }) => {
                        let source = this.NavisOrder[item.i][1],
                            target = this.NavisOrder[i][1]
                        target.splice(n, 0, ...source.splice(o, 1))
                    },
                    onUpdate: ({ oldIndex: o, newIndex: n }) => {
                        let source = this.NavisOrder[i][1]
                        source.splice(n, 0, ...source.splice(o, 1))
                    }
                }))
            },
            ModifyMenu(item) {
                let { id, menu, en, icon } = item
                this.ActionProto = { id, menu, en, icon }
                this.validator.register(this, this.ActionProto, () => ({
                    menu: ['noempty'],
                    icon: ['noempty'],
                    en: ['noempty'],
                }))
                this.Dialogs.ModifyMenu = noop => {
                    const action = id ? 'UpdateMenu' : 'CreateMenu'
                    this.request('Service/' + action, this.ActionProto).finally(this.RefreshContents)
                }
            },
            RemoveMenu(item) {
                this.ActionProto = item
                this.Dialogs.RemoveMenu = noop => {
                    this.request('Service/DeleteMenu', { id: item.id }).finally(this.RefreshContents)
                }
            },
            ModifyNavi(item) {
                let { id, menu_id, navi, path, en } = item
                this.ActionProto = { id, menu_id, navi, path, en }
                this.validator.register(this, this.ActionProto, () => ({
                    path: ['noempty'],
                    navi: ['noempty'],
                    en: ['noempty'],
                    menu_id: ['integer', [1], '请选择所属菜单'],
                }))
                this.Dialogs.ModifyNavi = noop => {
                    let action = id ? 'UpdateNavi' : 'CreateNavi'
                    this.request('Service/' + action, this.ActionProto).finally(this.RefreshContents)
                }
            },
            RemoveNavi(item) {
                this.ActionProto = item
                this.Dialogs.RemoveNavi = noop => {
                    this.request('Service/DeleteNavi', { id: item.id }).finally(this.RefreshContents)
                }
            },
            SaveOrder() {
                let { MenusOrder, NavisOrder } = this
                this.request('Service/ResetOrders', { MenusOrder, NavisOrder }).finally(this.RefreshContents)
            },
            CloseDialogs() {
                this.ActionProto = false
                for (let name in this.Dialogs) {
                    this.Dialogs[name] = false
                }
            }
        }
    }
    let i18n = {
        'tip-click': {
            en: 'Double-click the text to edit/add',
            cn: '双击文字编辑/添加',
        },
        'tip-changed': {
            en: 'Navigation changes require re-verification of role permissions',
            cn: '导航变更需要重新核验角色权限',
        },
        'tip-unregister': {
            en: 'To be registered routing/navigation',
            cn: '待注册路由/导航',
        },
        'tip-remove': {
            en: 'will be deleted',
            cn: '将被删除',
        },
        'Create Menu': {
            cn: '新建菜单',
        },
        'Modify Menu': {
            cn: '编辑菜单',
        },
        'Create Navi': {
            cn: '新建导航',
        },
        'Modify Navi': {
            cn: '编辑导航',
        },
        'Create': {
            cn: '新建',
        },
        'Modify': {
            cn: '编辑',
        },
        'Save Order': {
            cn: '保存顺序',
        },
        'menu': {
            en: 'Menu',
            cn: '菜单'
        },
        'icon': {
            en: 'Display Icon',
            cn: '图标'
        },
        'path': {
            en: 'Access Path',
            cn: '访问路径'
        },
    }
</script>
<style lang="scss">
    #MenuSorter {
        display: flex;
        flex-grow: 1;
        white-space: nowrap;
        overflow-x: auto;
        .card-header,
        .list-group-item {
            cursor: move;
        }
        dd:empty {
            background-color: #00000009;
            padding: 1.5rem;
        }
        >div+div {
            margin-left: 1rem;
        }
        .card-header .close {
            margin: -1rem -1rem 0 1rem;
        }
    }
</style>
