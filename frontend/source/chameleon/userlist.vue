<template>
    <div>
        <Navigation />
        <div class="d-flex mb-3">
            <span class="btn btn-outline-primary" @click="RefreshContents"><i class="bi bi-arrow-repeat" /> {{'Refresh'|i18n('button')}}</span>
            <span class="btn btn-success" @click="ModifyAccount({})"><i class="bi bi-plus-lg" /> {{'Create Account'|i18n(i18n)}}</span>
            <ContentFilter class="ms-auto" :Reload="RefreshContents" :Search="search" :Labels="labels" :i18n="i18n" />
        </div>
        <SortableTable :Columns="Columns" :Contents="Contents" :i18n="i18n">
            <th slot="append" class="text-center w-1">{{'Action'|i18n}}</th>
            <tr v-for="item in Contents" :key="item.id" :class="{'text-danger bg-light':item.lock_login, 'text-secondary bg-light':item.is_frozen, 'text-muted':item.lock_remove}">
                <td>{{item.create_at|datetime}}</td>
                <td>{{item.username}}</td>
                <td :class="{'text-danger':item.is_frozen}">
                    <span>{{item.rolename}}</span>
                    <span v-if="item.is_frozen">{{'Disabled'|i18n(i18n)}}</span><template v-else />
                </td>
                <td v-if="labels.includes('realname')">{{item.realname||'-'}}</td><template v-else />
                <td v-if="labels.includes('idcard')" class="font-monospace">{{item.idcard||"-"}}</td><template v-else />
                <td v-if="labels.includes('email')">{{item.email||'-'}}</td><template v-else />
                <td v-if="labels.includes('mobile')">{{item.mobile||'-'}}</td><template v-else />
                <td>{{item.last_login_ip||'-'}}</td>
                <td>{{item.last_login_at|datetime}}</td>
                <td class="pre">{{item.ip_white||'-'}}</td>
                <td class="pre">{{item.ip_black||'-'}}</td>
                <td>
                    <i class="bi bi-lg" :class="[item.lock_login?'bi-toggle-off text-danger':'bi-toggle-on', item.is_frozen?'text-muted':'text-success']" />
                    {{item.lock_login?'Disabled':'Enabled'|i18n(i18n)}}
                </td>
                <td class="text-center">
                    <slot v-if="Helper.Profile.uuid!==item.uuid">
                        <span class="text-primary me-1" role="button" @click="ModifyAccount(item)"><i class="bi bi-pencil-square" /></span>
                        <span v-if="item.lock_remove" class="text-muted" data-bs-toggle="tooltip" data-bs-placement="left" title="禁止删除"><i class="bi bi-person-circle" /></span>
                        <span v-else class="text-danger" role="button" @click="RemoveAccount(item)"><i class="bi bi-person-x" /></span>
                    </slot>
                    <span v-else class="badge bg-primary">正在使用</span>
                </td>
            </tr>
        </SortableTable>
        <Pagination :search="search" :total="TotalNum" @reload="RefreshContents" />
        <ModifyAccount v-if="Dialogs.ModifyAccount" :dismiss="CloseDialogs" :Done="RefreshContents" :ActionProto="ActionProto" />
        <Confirmation v-else-if="Dialogs.RemoveAccount" :dismiss="CloseDialogs" :Done="Dialogs.RemoveAccount" :VerifyPassword="true">
            账户 <span class="text-primary">{{ActionProto.username}}</span> 将被删除
        </Confirmation><template v-else />
    </div>
</template>
<script>
    export default {
        components: {
            ModifyAccount: () => import('./helper/user-modify'),
        },
        data() {
            return {
                search: { sk: '', sv: '', page: 1, limit: 20 },
                labels: ['username', 'rolename', 'ip_white', 'ip_black', 'remark'],
                Columns: [
                    { sort: 'number', field: 'create_at', class: 'w-1' },
                    { sort: 'string', field: 'username' },
                    { sort: 'string', field: 'rolename' },
                    { sort: 'string', field: 'last_login_ip' },
                    { sort: 'number', field: 'last_login_at' },
                    { sort: false, field: 'ip_white' },
                    { sort: false, field: 'ip_black' },
                    { sort: 'amount', field: 'lock_login' }
                ],
                Contents: [],
                ExtraCol: {},
                TotalNum: 0,
                ActionProto: false,
                Dialogs: {
                    ModifyAccount: false,
                    RemoveAccount: false
                }
            }
        },
        computed: {
            i18n: () => i18n
        },
        created() {
            const { account_realname, account_email, account_mobile, account_idcard } = this.Helper.Rules
            if (account_mobile != 'Disabled') {
                this.labels.splice(2, 0, 'mobile')
                this.Columns.splice(3, 0, { sort: 'string', field: 'mobile' })
            }
            if (account_email != 'Disabled') {
                this.labels.splice(2, 0, 'email')
                this.Columns.splice(3, 0, { sort: 'string', field: 'email' })
            }
            if (account_idcard != 'Disabled') {
                this.labels.splice(2, 0, 'idcard')
                this.Columns.splice(3, 0, { sort: 'string', field: 'idcard' })
            }
            if (account_realname != 'Disabled') {
                this.labels.splice(2, 0, 'realname')
                this.Columns.splice(3, 0, { sort: 'string', field: 'realname' })
            }
            this.search.sk = this.labels[0]
            this.RefreshContents()
        },
        methods: {
            RefreshContents() {
                this.CloseDialogs()
                this.request('Account/ListUsers', this.search).resolve(success => {
                    this.Contents = success.lists
                    this.TotalNum = success.total
                })
            },
            ModifyAccount(item) {
                this.Dialogs.ModifyAccount = true
                this.ActionProto = { ...item }
            },
            RemoveAccount(item) {
                this.ActionProto = { ...item }
                this.Dialogs.RemoveAccount = VerifyPassword => {
                    const id = item.id
                    const EventDetail = {
                        subject: '删除账户',
                        before: item,
                        i18n
                    }
                    this.request('Account/DeleteUser', { id, VerifyPassword, EventDetail }).resolve(this.RefreshContents)
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
        'create_at': {
            en: 'Active Time',
            cn: '激活时间'
        },
        'username': {
            en: 'Account Name',
            cn: '账户名称'
        },
        'realname': {
            en: 'Real Name',
            cn: '真实姓名'
        },
        'email': {
            en: 'Email Address',
            cn: '邮箱地址'
        },
        'mobile': {
            en: 'Mobile Phone',
            cn: '手机号码'
        },
        'idcard': {
            en: 'ID No.',
            cn: '身份证号'
        },
        'rolename': {
            en: 'Role Name',
            cn: '角色名称'
        },
        'last_login_ip': {
            en: 'Last Login IP',
            cn: '最后登录IP'
        },
        'last_login_at': {
            en: 'Last Login Time',
            cn: '最后登录时间'
        },
        'ip_white': {
            en: 'IP whitelist',
            cn: 'IP白名单'
        },
        'ip_black': {
            en: 'IP blacklist',
            cn: 'IP黑名单'
        },
        'lock_login': {
            en: 'Status',
            cn: '账户状态'
        },
        'remark': {
            en: 'Remark',
            cn: '备注'
        },
        'Create Account': {
            cn: '新建账户'
        },
        'Enabled': {
            cn: '启用'
        },
        'Disabled': {
            cn: '禁用'
        },
    }
</script>
