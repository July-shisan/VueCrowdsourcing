<template>
    <PopWindow :dismiss="dismiss" :Done="false">
        <template #title>{{'Role Information'|i18n(i18n)}}</template>
        <div class="form-group">
            <label>{{'Role Name'|i18n(i18n)}}</label>
            <small v-if="ActionProto.lock_assign" class="text-muted"><i class="bi bi-lock" /> {{'Lock Assign'|i18n(i18n)}}</small>
            <span class="form-control bg-light">{{ActionProto.rolename}}</span>
        </div>
        <div class="form-group">
            <label>{{'Assigned Permissions'|i18n(i18n)}}</label>
            <select disabled size="8" class="form-control bg-light">
                <optgroup v-for="(label, id) in AssignedMenus" :key="id" :label="label|i18n('menu')">
                    <option v-for="navi_id in AssignedAuths[id]" :key="navi_id">{{navi_id|i18n('navi')}}</option>
                </optgroup>
            </select>
        </div>
        <div class="form-group">
            <label>{{'remark'|i18n(i18n)}}</label>
            <pre class="rounded border bg-light p-2">{{ActionProto.remark}}</pre>
        </div>
        <div class="form-group">
            <label>{{'Enabled State'|i18n(i18n)}}</label>
            <i class="bi bi-lg" :class="ActionProto.is_frozen?'bi-toggle-off text-danger':'bi-toggle-on text-success'" />
            <span :class="ActionProto.is_frozen?'text-danger':'text-success'">{{ActionProto.is_frozen?'Disabled':'Enabled'|i18n(i18n)}}</span>
        </div>
        <div class="form-group">
            <label>{{'Default Role'|i18n(i18n)}}</label>
            <i class="bi bi-lg" :class="ActionProto.is_default?'bi-toggle-on text-success':'bi-toggle-off text-muted'" />
            <span :class="ActionProto.is_default?'text-success':'text-muted'">{{ActionProto.is_default?'Enabled':'Disabled'|i18n(i18n)}}</span>
        </div>
    </PopWindow>
</template>
<script>
    export default {
        props: {
            ActionProto: {
                type: Object,
                required: true
            },
            dismiss: {
                type: Function,
                required: true
            },
        },
        data() {
            return {
                AssignedAuths: {},
                AssignedMenus: {},
            }
        },
        computed: {
            i18n: () => i18n,
        },
        created() {
            this.loadRoleAuths()
        },
        methods: {
            loadRoleAuths() {
                let role_id = this.ActionProto.id
                this.request('Account/ListRoleAuths', { role_id }).resolve(success => {
                    let Menus = {},
                        Navis = {},
                        Auths = success.auths.reduce((rtn, { navi_id }) => ([...rtn, navi_id]), [])
                    success.navis.map(({ menu_id, menu, navi_id }) => {
                        if (Auths.includes(navi_id)) {
                            Menus[menu] = menu_id
                            Navis[menu] = Navis[menu] || []
                            Navis[menu].push(navi_id)
                        }
                    })
                    this.AssignedMenus = Menus
                    this.AssignedAuths = Navis
                })
            },
        }
    }
    let i18n = {
        'Role Information': {
            cn: '角色信息'
        },
        'Role Name': {
            cn: '角色名称'
        },
        'Enabled State': {
            cn: '启用状态'
        },
        'Default Role': {
            cn: '默认角色'
        },
        'Enabled': {
            cn: '启用'
        },
        'Disabled': {
            cn: '禁用'
        },
        'Assigned Permissions': {
            cn: '分配的权限'
        },
        'remark': {
            en: 'Remark',
            cn: '备注'
        },
        'Lock Assign': {
            cn: '锁定分配'
        },
    }
</script>
