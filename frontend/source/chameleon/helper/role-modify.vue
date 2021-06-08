<template>
    <PopWindow :dismiss="dismiss" :Done="doAction" :btnConfig="{checker:validator,class:ActionProto.id?'':'btn-success'}" :VerifyPassword="true">
        <template #title>{{ActionProto.id?'Modify Role':'Create Role'|i18n(helper)}}</template>
        <template #button>{{ActionProto.id?'Modify Role':'Create Role'|i18n(helper)}}</template>
        <div class="mb-3">
            <label class="form-label">{{'rolename'|i18n(i18n)}}</label>
            <input v-model.trim="Params.rolename" class="form-control" type="text" maxlength="30" :class="{'is-invalid':tips.rolename}" @blur="validator.check('rolename')">
            <span class="invalid-feedback">{{tips.rolename|i18n(helper)}}</span>
        </div>
        <div class="swap-list mb-3">
            <label>
                <span>{{'Assigned Permissions'|i18n(helper)}}</span>
                <select v-model="preRemove" multiple size="8" class="form-select" :class="{'border border-danger':tips.auths}">
                    <optgroup v-for="(menu_id, menu) in Stash.AssignedMenus" :key="menu" :label="menu_id|i18n('menu')">
                        <option v-for="{navi_id, lock_assign} in Stash.AssignedNavis[menu]" :key="navi_id" :value="navi_id" :disabled="!!lock_assign" :class="{'lock_assign':lock_assign}">{{navi_id|i18n("navi")}}</option>
                    </optgroup>
                </select>
            </label>
            <section class="btn-group-vertical">
                <button type="button" :disabled="!preAppend.length" class="btn btn-outline-dark border" @click="doAppend"><i class="bi bi-chevron-left" /></button>
                <button type="button" :disabled="!preRemove.length" class="btn btn-outline-dark border" @click="doRemove"><i class="bi bi-chevron-right" /></button>
                &nbsp;
                <button type="button" class="btn btn-outline-dark border" @click="doAppend(true)"><i class="bi bi-chevron-double-left" /></button>
                <button type="button" class="btn btn-outline-dark border" @click="doRemove(true)"><i class="bi bi-chevron-double-right" /></button>
            </section>
            <label>
                <span>{{'Unassigned Permissions'|i18n(helper)}}</span>
                <select v-model="preAppend" multiple size="8" class="form-select">
                    <optgroup v-for="(menu_id, menu) in Stash.UnsignedMenus" :key="menu" :label="menu_id|i18n('menu')">
                        <option v-for="{navi_id, lock_assign} in Stash.UnsignedNavis[menu]" :key="navi_id" :value="navi_id" :disabled="!!lock_assign" :class="{'lock_assign':lock_assign}">{{navi_id|i18n("navi")}}</option>
                    </optgroup>
                </select>
            </label>
        </div>
        <span class="form-control d-none" :class="{'is-invalid':tips.auths}" />
        <div class="invalid-feedback">{{tips.auths}}</div>
        <div class="mb-3">
            <label class="form-label">{{'remark'|i18n(i18n)}}</label>
            <textarea v-model.trim="Params.remark" class="form-control" :class="{'is-invalid':tips.remark}" @blur="validator.check('remark')" />
            <span class="invalid-feedback">{{tips.remark}}</span>
        </div>
        <template v-if="ActionProto.is_default">
            <div class="mb-3">
                <label class="form-label">{{'is_frozen'|i18n(i18n)}}</label>
                <label>
                    <i class="bi bi-lg bi-toggle-on text-success" />
                    <span class="text-muted">{{'Enabled'|i18n(helper)}}</span>
                    <small class="text-muted">{{'no-frozen'|i18n(helper)}}</small>
                </label>
            </div>
            <div class="mb-3">
                <label class="form-label">{{'is_default'|i18n(i18n)}}</label>
                <label>
                    <i class="bi bi-lg bi-toggle-on text-success" />
                    <span class="text-muted">{{'Enabled'|i18n(helper)}}</span>
                    <small class="text-muted">{{'no-deactive'|i18n(helper)}}</small>
                </label>
            </div>
        </template>
        <template v-else>
            <div class="mb-3">
                <label>{{'is_frozen'|i18n(i18n)}}</label>
                <label class="pointer">
                    <input v-model="Params.is_frozen" type="checkbox" class="d-none">
                    <i class="bi bi-lg" :class="Params.is_frozen?'bi-toggle-off text-danger':'bi-toggle-on text-success'" />
                    <span :class="Params.is_frozen?'text-danger':'text-success'">{{Params.is_frozen?'Disabled':'Enabled'|i18n(helper)}}</span>
                    <small v-if="Params.is_frozen" class="text-muted">{{'When disabled, all associated users will be banned from logging in'|i18n(helper)}}</small>
                </label>
            </div>
            <div class="mb-3">
                <label>{{'is_default'|i18n(i18n)}}</label>
                <label class="pointer">
                    <input v-model="Params.is_default" type="checkbox" class="d-none">
                    <i class="bi bi-lg" :class="Params.is_default?'bi-toggle-on text-success':'bi-toggle-off text-muted'" />
                    <span :class="Params.is_default?'text-success':'text-muted'">{{Params.is_default?'Enabled':'Disabled'|i18n(helper)}}</span>
                    <small v-if="Params.is_default" class="text-muted">{{'Only one role can be set as default'|i18n(helper)}}</small>
                </label>
            </div>
        </template>
    </PopWindow>
</template>
<script>
    export default {
        props: {
            ActionProto: {
                type: Object,
                default: () => ({})
            },
            Done: {
                type: Function,
                required: true
            },
            dismiss: {
                type: Function,
                required: true
            },
        },
        data() {
            return {
                Navis: [],
                preAppend: [],
                preRemove: [],
                Params: {}
            }
        },
        computed: {
            i18n: () => i18n,
            helper: () => helper,
            tips() {
                return this.validator.tips
            },
            Stash() {
                let AssignedMenus = {},
                    AssignedNavis = {},
                    UnsignedMenus = {},
                    UnsignedNavis = {},
                    exists = [...this.Params.auths]
                this.Navis.map(({ menu, menu_id, navi_id, lock_assign }) => {
                    if (exists.includes(navi_id)) {
                        AssignedMenus[menu] = menu_id
                        AssignedNavis[menu] = AssignedNavis[menu] || []
                        AssignedNavis[menu].push({ navi_id, lock_assign })
                    } else {
                        UnsignedMenus[menu] = menu_id
                        UnsignedNavis[menu] = UnsignedNavis[menu] || []
                        UnsignedNavis[menu].push({ navi_id, lock_assign })
                    }
                })
                return { AssignedMenus, AssignedNavis, UnsignedMenus, UnsignedNavis }
            },
            unTouched() {
                return JSON.stringify(this.Params) == JSON.stringify(this.InitParams)
            },
        },
        created() {
            const { id: role_id, rolename = '', remark = '', is_frozen = false, is_default = false } = this.ActionProto
            this.Params = { role_id, rolename, remark, is_frozen, is_default, auths: [], noop: false }
            this.validator.register(this, this.Params, () => ({
                rolename: ['noempty'],
                remark: ['length', [null, 128]],
                auths: ['length', [1], 'Please assign at least one permission', i18n],
                noop: [() => this.unTouched, '未修改'],
            }))
            this.loadRoleAuths()
        },
        methods: {
            loadRoleAuths() {
                let { id: role_id } = this.ActionProto
                this.request('Account/ListRoleAuths', { role_id }).resolve(success => {
                    const auths = success.auths.reduce((rtn, { navi_id }) => ([...rtn, navi_id]), [])
                    this.Navis = success.navis
                    this.Params.auths = auths
                    this.ActionProto.auths = [...auths]
                })
            },
            doAction(VerifyPassword) {
                const { role_id: id, rolename, noop, ...params } = this.Params
                this.request('Account/ListRoles', { sk: 'rolename', sv: rolename }).resolve(success => {
                    if (success.total && success.lists[0].id != id) {
                        return this.tips.rolename = 'duplicated rolename'
                    }
                    const action = id ? 'UpdateRole' : 'CreateRole',
                          { auths: before } = this.ActionProto,
                          { auths: after } = params
                    const EventDetail = {
                        subject: id ? '更新角色' : '创建角色',
                        i18n: { ...i18n, 'is_frozen': { cn: '禁用' } }
                    }
                    let [a, b] = this.Navis.reduce((rtn, { menu, navi, navi_id }) => {
                        if (before.includes(navi_id)) {
                            rtn[0][menu] += '\n    ' + navi
                        }
                        if (before.includes(navi_id) && !after.includes(navi_id)) {
                            rtn[1][menu] += '\n  - ' + navi
                        } else if (!before.includes(navi_id) && after.includes(navi_id)) {
                            rtn[1][menu] += '\n  + ' + navi
                        }
                        rtn[0][menu] ? rtn[0][menu] = rtn[0][menu].replace('undefined', menu) : null
                        rtn[1][menu] ? rtn[1][menu] = rtn[1][menu].replace('undefined', menu) : null
                        return rtn
                    }, [{}, {}])
                    this.ActionProto.auths = Object.values(a).join('\n')
                    id ? EventDetail.before = this.ActionProto : null
                    EventDetail.replace = {
                        auths: Object.values(b).join('\n')
                    }
                    this.request('Account/' + action, { id, rolename, ...params, VerifyPassword, EventDetail }).resolve(this.Done)
                })
            },
            doAppend(all) {
                let { Params, Navis, preAppend } = this
                preAppend = all === true ? Navis.reduce((rtn, { navi_id: id, lock_assign: lock }) => lock ? rtn : [...rtn, id], []) : preAppend
                Params.auths = [...Params.auths, ...preAppend]
                this.preAppend = []
                this.preRemove = []
                this.validator.check('auths')
            },
            doRemove(all) {
                let { Params, Navis, preRemove } = this
                preRemove = all === true ? Navis.reduce((rtn, { navi_id: id, lock_assign: lock }) => lock && Params.auths.includes(id) ? rtn : [...rtn, id], []) : preRemove
                Params.auths = Params.auths.filter(id => !preRemove.includes(id))
                this.preAppend = []
                this.preRemove = []
                this.validator.check('auths')
            },
        }
    }
    let i18n = {
        'rolename': {
            en: 'Role Name',
            cn: '角色名称'
        },
        'is_frozen': {
            en: 'Available',
            cn: '启用状态'
        },
        'is_default': {
            en: 'Default Role',
            cn: '默认角色'
        },
        'remark': {
            en: 'Remark',
            cn: '备注'
        },
    }
    let helper = {
        'Create Role': {
            cn: '创建角色'
        },
        'Modify Role': {
            cn: '编辑角色'
        },
        'Enabled': {
            cn: '启用'
        },
        'Disabled': {
            cn: '禁用'
        },
        'When disabled, all associated users will be banned from logging in': {
            cn: '禁用后，关联用户将仅能使用个人密码相关功能。'
        },
        'Only one role can be set as default': {
            cn: '只能设定一个默认角色'
        },
        'Assigned Permissions': {
            cn: '分配的权限'
        },
        'Unassigned Permissions': {
            cn: '未分配的权限'
        },
        'Please assign at least one permission': {
            cn: '请至少分配一个权限'
        },
        'Role is locked': {
            cn: '角色已锁定，无法编辑'
        },
        'duplicated rolename': {
            cn: '角色名称重复，请替换'
        },
        'no-frozen': {
            en: 'Default role can NOT disabled',
            cn: '默认角色不能禁用'
        },
        'no-deactive': {
            en: 'Can not deactivate',
            cn: '无法停用'
        }
    }
</script>
