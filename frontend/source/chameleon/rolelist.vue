<template>
    <div>
        <Navigation />
        <div class="d-flex mb-3">
            <span class="btn btn-outline-primary" @click="RefreshContents"><i class="bi bi-arrow-repeat" /> {{'Refresh'|i18n('button')}}</span>
            <span class="btn btn-success" @click="ModifyRole({})"><i class="bi bi-plus-lg" /> {{'Create Role'|i18n(i18n)}}</span>
            <ContentFilter class="ms-auto" :Reload="RefreshContents" :Search="search" :Labels="labels" :i18n="i18n" />
        </div>
        <SortableTable :Columns="Columns" :Contents="Contents" :i18n="i18n">
            <th slot="append" class="text-center w-1">{{'Action'|i18n}}</th>
            <tr v-for="item in Contents" :key="item.id" :class="{'text-success':item.is_default,'text-secondary':item.is_frozen}">
                <td>{{item.create_at|datetime}}</td>
                <td>
                    <span>{{item.rolename}}</span>
                    <span v-if="item.lock_assign" data-bs-toggle="tooltip" :title="'Lock Assign'|i18n(i18n)"><i class="bi bi-shield-lock-fill" /></span>
                </td>
                <td>{{item.remark||'-'}}</td>
                <td v-if="item.is_frozen"><i class="bi bi-lg bi-toggle-off text-secondary" /> {{'Disabled'|i18n(i18n)}}</td>
                <td v-else><i class="bi bi-lg bi-toggle-on text-success" /> {{'Enabled'|i18n(i18n)}}</td>
                <td v-if="item.is_debiult"><i class="bi bi-lg bi-toggle-on text-success" /> {{'Yes'|i18n(i18n)}}</td>
                <td v-else><i class="bi bi-lg bi-toggle-off text-muted" /> {{'No'|i18n(i18n)}}</td>
                <td class="text-center">
                    <span v-if="item.lock_modify" role="button" data-bs-toggle="tooltip" data-bs-placement="left" title="禁止编辑" @click="ReviewRole(item)">
                        <i class="bi bi-eye text-dark" />
                    </span>
                    <span v-else role="button" @click="ModifyRole(item)">
                        <i class="bi bi-pencil-square text-primary" />
                    </span>
                    <span v-if="item.lock_remove||item.is_debiult" role="button" data-bs-toggle="tooltip" data-bs-placement="left" :title="(item.is_debiult?'默认角色':'')+'禁止删除'" @click="ModifyRole(item)">
                        <i class="bi bi-lock-fill text-muted" />
                    </span>
                    <span v-else role="button" @click="RemoveRole(item)">
                        <i class="bi bi-x-lg text-danger" />
                    </span>
                </td>
            </tr>
        </SortableTable>
        <Pagination :search="search" :total="TotalNum" @reload="RefreshContents" />
        <ModifyRole v-if="Dialogs.ModifyRole" :dismiss="CloseDialogs" :Done="RefreshContents" :ActionProto="ActionProto" />
        <ReviewRole v-else-if="Dialogs.ReviewRole" :dismiss="CloseDialogs" :ActionProto="ActionProto" />
        <Confirmation v-else-if="Dialogs.RemoveRole" :dismiss="CloseDialogs" :Done="Dialogs.RemoveRole" :VerifyPassword="true">
            <template #title>{{'Delete Role'|i18n(i18n)}}</template>
            {{'Role'|i18n(i18n)}} <span class="text-primary">{{ActionProto.rolename}}</span> {{'will be deleted'|i18n(i18n)}}
        </Confirmation><template v-else />
    </div>
</template>
<script>
    export default {
        components: {
            ModifyRole: () => import('./helper/role-modify'),
            ReviewRole: () => import('./helper/role-review'),
        },
        data() {
            return {
                search: { sk: '', sv: '', page: 1, limit: 10 },
                labels: ['rolename', 'remark'],
                Columns: [
                    { sort: 'number', field: 'create_at', class: 'w-1' },
                    { sort: 'string', field: 'rolename' },
                    { sort: 'string', field: 'remark' },
                    { sort: 'amount', field: 'is_frozen' },
                    { sort: 'amount', field: 'is_default' }
                ],
                Contents: [],
                TotalNum: 0,
                ActionProto: false,
                Dialogs: {
                    ModifyRole: false,
                    RemoveRole: false,
                    ReviewRole: false,
                }
            }
        },
        computed: {
            i18n: () => i18n,
            CheckedRows() {
                return this.Contents.filter(item => item._checked)
            }
        },
        created() {
            this.search.sk = this.labels[0]
            this.RefreshContents()
        },
        methods: {
            RefreshContents() {
                this.CloseDialogs()
                this.request('Account/ListRoles', this.search).resolve(success => {
                    this.Contents = success.lists
                    this.TotalNum = success.total
                })
            },
            ReviewRole(item) {
                this.Dialogs.ReviewRole = true
                this.ActionProto = { ...item }
            },
            ModifyRole(item) {
                this.Dialogs.ModifyRole = true
                this.ActionProto = { ...item }
            },
            RemoveRole(item) {
                this.ActionProto = { ...item }
                this.Dialogs.RemoveRole = VerifyPassword => {
                    let { id, create_at, rolename, is_frozen, is_default, remark } = item
                    const EventDetail = {
                        subject: '删除角色',
                        before: { create_at, rolename, remark, is_frozen, is_default },
                        i18n: { ...i18n, 'is_frozen': { cn: '禁用' } }
                    }
                    this.request('Account/DeleteRole', { id, VerifyPassword, EventDetail }).resolve(this.RefreshContents)
                }
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
        'Create Role': {
            cn: '新建角色'
        },
        'Delete Role': {
            cn: '删除角色'
        },
        'Role': {
            cn: '角色'
        },
        'will be deleted': {
            cn: '将被删除'
        },
        'rolename': {
            en: 'Role Name',
            cn: '角色名称'
        },
        'create_at': {
            en: 'Record Time',
            cn: '创建时间'
        },
        'remark': {
            en: 'Remark',
            cn: '备注'
        },
        'is_frozen': {
            en: 'Available',
            cn: '启用状态'
        },
        'is_default': {
            en: 'Default Role',
            cn: '默认角色'
        },
        'Lock Assign': {
            cn: '禁止分配'
        },
        'Yes': {
            cn: '是'
        },
        'No': {
            cn: '否'
        },
        'Enabled': {
            cn: '启用'
        },
        'Disabled': {
            cn: '禁用'
        }
    }
</script>
