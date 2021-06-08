<template>
    <div>
        <Navigation />
        <div class="d-flex mb-3">
            <span class="btn btn-outline-primary" @click="RefreshContents"><i class="bi bi-arrow-repeat" /> {{'Refresh'|i18n('button')}}</span>
            <ContentFilter class="ms-auto" :Reload="RefreshContents" :Search="search" :Labels="labels" :i18n="i18n" />
        </div>
        <SortableTable :Columns="Columns" :Contents="Contents" :i18n="i18n">
            <th slot="append" class="text-center w-1">{{'Action'|i18n}}</th>
            <tr v-for="item in Contents" :key="item.issued">
                <td>{{item.issued|datetime}}</td>
                <td>{{item.address}}</td>
                <td>{{item.rolename||'-'}}</td>
                <td>{{item.username||'-'}}</td>
                <td v-if="labels.includes('realname')">{{item.realname||'-'}}</td><template v-else />
                <td v-if="labels.includes('idcard')">{{item.idcard||'-'}}</td><template v-else />
                <td v-if="labels.includes('mobile')">{{item.mobile||'-'}}</td><template v-else />
                <td v-if="labels.includes('email')">{{item.email||'-'}}</td><template v-else />
                <td>{{item.last_login_ip||'-'}}</td>
                <td>{{item.last_login_at|datetime}}</td>
                <td class="text-center">
                    <span v-if="item._locked" class="badge bg-primary">{{"It's you"|i18n(i18n)}}</span>
                    <span v-else-if="!item.uuid" class="badge bg-secondary">{{'Visitor'|i18n(i18n)}}</span>
                    <span v-else role="button" class="badge bg-danger" @click="OfflineUser(item)"><i class="bi bi-lg bi-power text-light" /></span>
                </td>
            </tr>
        </SortableTable>
        <Pagination :search="search" :total="TotalNum" @reload="RefreshContents" />
        <Confirmation v-if="Dialogs.OfflineUser" :dismiss="CloseDialogs" :Done="ForceOffline" :VerifyPassword="true">
            <template #title>强制用户离线</template>
            <template #alert>强制用户离线将中断用户操作，任何未完成的操作都将无法恢复</template>
            强制用户离线
        </Confirmation><template v-else />
    </div>
</template>
<script>
    export default {
        data() {
            return {
                search: { sk: '', sv: '', page: 1, limit: 50 },
                labels: ['address', 'rolename', 'username', 'last_login_ip'],
                Columns: [
                    { sort: 'number', field: 'issued', class: 'w-1' },
                    { sort: 'number', field: 'address' },
                    { sort: 'string', field: 'rolename' },
                    { sort: 'string', field: 'username' },
                    { sort: 'number', field: 'last_login_ip' },
                    { sort: 'number', field: 'last_login_at' },
                ],
                Contents: [],
                TotalNum: 0,

                ActionProto: false,
                Dialogs: {
                    OfflineUser: false
                }
            }
        },
        computed: {
            i18n: () => i18n,
        },
        created() {
            const { account_realname, account_email, account_mobile, account_idcard } = this.Helper.Rules
            if (account_email != 'Disabled') {
                this.labels.splice(3, 0, 'email')
                this.Columns.splice(4, 0, { sort: 'string', field: 'email' })
            }
            if (account_mobile != 'Disabled') {
                this.labels.splice(3, 0, 'mobile')
                this.Columns.splice(4, 0, { sort: 'string', field: 'mobile' })
            }
            if (account_idcard != 'Disabled') {
                this.labels.splice(3, 0, 'idcard')
                this.Columns.splice(4, 0, { sort: 'string', field: 'idcard' })
            }
            if (account_realname != 'Disabled') {
                this.labels.splice(3, 0, 'realname')
                this.Columns.splice(4, 0, { sort: 'string', field: 'realname' })
            }
            this.search.sk = this.labels[0]
            this.RefreshContents()
        },
        methods: {
            RefreshContents() {
                this.CloseDialogs()
                this.request('System/ListOnlines', this.search).resolve(success => {
                    let { uuid, issued } = this.Helper.Profile
                    this.TotalNum = success.total
                    this.Contents = success.lists.map(item => Object.assign(item, { _locked: item.uuid == uuid && item.issued == issued }))
                })
            },
            OfflineUser(item) {
                this.ActionProto = item
                this.Dialogs.OfflineUser = true
            },
            ForceOffline(VerifyPassword) {
                let { uuid, address, issued } = this.ActionProto
                this.request('System/ForceOffline', { uuid, address, issued, VerifyPassword }).resolve(success => {
                    this.RefreshContents()
                })
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
        'issued': {
            en: 'Access Time',
            cn: '访问时间'
        },
        'address': {
            en: 'Access IP Address',
            cn: '访问IP'
        },
        'username': {
            en: 'Account Name',
            cn: '账户名称'
        },
        'rolename': {
            en: 'Role Name',
            cn: '角色名称'
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
        'last_login_ip': {
            en: 'Login IP',
            cn: '登录IP'
        },
        'last_login_at': {
            en: 'Login Time',
            cn: '登录时间'
        },
        'It\'s you': {
            cn: '正在使用'
        },
        'Visitor': {
            cn: '游客'
        },
    }
</script>
