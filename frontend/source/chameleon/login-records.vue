<template>
    <div>
        <Navigation />
        <div class="d-flex mb-3">
            <span class="btn btn-outline-primary" @click="RefreshContents"><i class="bi bi-arrow-repeat" /> {{'Refresh'|i18n('button')}}</span>
            <span class="btn btn-secondary ms-auto" @click="showFilter=!showFilter"><i class="bi bi-three-dots" /></span>
            <div v-if="showFilter" class="btn-toolbar">
                <div class="btn-group ms-2">
                    <span class="btn btn-outline-secondary" :class="{active:search.logout.includes(0)}" @click="filterLogout(0)"><i class="bi bi-key-fill" /> {{'Sign In'|i18n(i18n)}}</span>
                    <span class="btn btn-outline-secondary" :class="{active:search.logout.includes(1)}" @click="filterLogout(1)"><i class="bi bi-power" /> {{'Sign Out'|i18n(i18n)}}</span>
                </div>
                <div class="btn-group ms-2">
                    <span class="btn btn-outline-secondary" :class="{active:search.status.includes(0)}" @click="filterStatus(0)"><i class="bi bi-check-lg" /> {{'Success'|i18n(i18n)}}</span>
                    <span class="btn btn-outline-secondary" :class="{active:search.status.includes(1)}" @click="filterStatus(1)"><i class="bi bi-x-lg" /> {{'Failure'|i18n(i18n)}}</span>
                </div>
            </div>
            <ContentFilter class="ms-2" :Reload="RefreshContents" :Search="search" :Labels="labels" :i18n="i18n" />
        </div>
        <SortableTable :Columns="Columns" :Contents="Contents" :i18n="i18n">
            <tr v-for="item in Contents" :key="item.id" :class="{'text-secondary':item.status}">
                <td>{{item.create_at|datetime}}</td>
                <td><i class="bi" :class="item.is_logout?'bi-power text-secondary':'bi-key-fill text-primary'" /> {{item.is_logout?"Sign Out":"Sign In"|i18n(i18n)}}</td>
                <td v-if="item.is_logout">
                    <i class="bi bi-info-lg text-info" /> {{item.reason|i18n("errors")}}
                </td>
                <td v-else>
                    <i class="bi" :class="item.reason?'bi-times-lg text-danger':'bi-check-lg text-success'" /> {{item.reason|i18n("errors")}}
                </td>
                <td>{{item.username}}</td>
                <td>{{item.address}}</td>
                <td class="pre">{{item.agent_id}}</td>
            </tr>
        </SortableTable>
        <Pagination :search="search" :total="TotalNum" @reload="RefreshContents" />
    </div>
</template>
<script>
    export default {
        props: {
            self: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                showFilter: false,
                search: { sk: '', sv: '', logout: [], status: [], page: 1, limit: 10 },
                labels: ['address'],
                Columns: [
                    { sort: 'number', field: 'create_at' },
                    { sort: 'amount', field: 'is_logout' },
                    { sort: 'string', field: 'status' },
                    { sort: 'string', field: 'username' },
                    { sort: 'number', field: 'address' },
                    { sort: 'string', field: 'agent_id' }
                ],
                Contents: [],
                TotalNum: 0
            }
        },
        computed: {
            i18n: () => i18n,
            status: () => status,
        },
        created() {
            this.search.selfRecords = this.self
            if (!this.self) {
                this.labels = ['username', ...this.labels]
            }
            this.search.sk = this.labels[0]
            this.RefreshContents()
        },
        methods: {
            RefreshContents() {
                const { logout, status, selfRecords } = this.search
                this.showFilter = logout.length + status.length > 0
                const action = selfRecords ? 'ListOwnLogins' : 'ListLogins'
                this.request('System/' + action, this.search).resolve(success => {
                    let { lists, total, agents } = success
                    agents = agents.reduce((rtn, { id, ua }) => ({ ...rtn, [id]: ua }), {})
                    this.Contents = lists.map(item => {
                        item.status = Number(item.status)
                        item.agent_id = agents[item.agent_id]
                        return item
                    })
                    this.TotalNum = total
                })
            },
            filterLogout(type) {
                this.search.logout = this.search.logout.includes(type) ? [] : [type]
                this.RefreshContents()
            },
            filterStatus(type) {
                this.search.status = this.search.status.includes(type) ? [] : [type]
                this.RefreshContents()
            }
        }
    }
    let status = {
        '0': {
            cn: '成功',
            en: 'Success',
        },
        '1': {
            cn: '系统白名单拒绝',
            en: 'System whitelist rejected',
        },
        '2': {
            cn: '用户白名单拒绝',
            en: 'User whitelist rejected',
        },
        '3': {
            cn: '系统黑名单拒绝',
            en: 'User blacklist rejected',
        },
        '4': {
            cn: '用户黑名单拒绝',
            en: 'User blacklist rejected',
        },
        '6': {
            cn: '角色未启用',
            en: 'Role not exist',
        },
        '7': {
            cn: '超出认证失败次数！',
            en: 'The number of authentication failures exceeded!',
        },
        '8': {
            cn: '账号或密码错误',
            en: 'Incorrect username or password',
        },
        '9': {
            cn: '账号或密码错误',
            en: 'Incorrect username or password',
        }
    }
    let i18n = {
        'create_at': {
            en: 'Record Time',
            cn: '记录时间'
        },
        'is_logout': {
            en: 'Type',
            cn: '类型'
        },
        'status': {
            en: 'Status',
            cn: '状态'
        },
        'username': {
            en: 'Account name',
            cn: '登录帐户'
        },
        'address': {
            en: 'Access IP Address',
            cn: '访问 IP'
        },
        'agent_id': {
            en: 'User Agent',
            cn: '浏览器'
        },
        'Sign In': {
            cn: '登入'
        },
        'Sign Out': {
            cn: '登出'
        },
        'Success': {
            cn: '成功'
        },
        'Failure': {
            cn: '失败'
        }
    }
</script>
