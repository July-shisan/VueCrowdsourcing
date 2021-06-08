<template>
    <div>
        <Navigation />
        <div class="d-flex mb-3">
            <span class="btn btn-outline-primary" @click="RefreshContents"><i class="bi bi-arrow-repeat" /> {{'Refresh'|i18n('button')}}</span>
            <span class="btn btn-secondary ms-auto" @click="showFilter^=true"><i class="bi bi-three-dots" /></span>
            <div v-if="showFilter" class="btn-group ms-2">
                <span v-for="v in Filters" :key="v" class="btn btn-outline-secondary" :class="{active:Status.includes(v)}" @click="FilterStatus(v)">{{v|i18n(i18n)}}</span>
            </div><template v-else />
            <ContentFilter class="ms-2" :Reload="RefreshContents" :Search="search" :Labels="labels" :i18n="i18n" />
        </div>
        <SortableTable :Columns="Columns" :Contents="Contents" :i18n="i18n">
            <th slot="append" class="text-center text-nowrap w-1">{{'Action'|i18n}}</th>
            <tr v-for="item in Contents" :key="item.id" :class="item.method|color">
                <td>{{item.create_at|datetime}}</td>
                <td>{{item.user_ip}}</td>
                <td colspan="2">{{item.username}} / {{item.rolename}}</td>
                <td>{{item.subject}}</td>
                <td>{{item.method|i18n(method)}}</td>
                <td>{{item.relate}}</td>
                <td>{{item.audit_at|datetime}}</td>
                <td>{{item.audit_ip||'-'}}</td>
                <td>{{item.auditor||'-'}}</td>
                <td><span class="badge rounded-pill" :class="item.status|badge">{{item.status|i18n(i18n)}}</span></td>
                <td class="pre">{{item.reason||'-'|i18n('errors')}}</td>
                <td class="text-center">
                    <span role="button" @click="item.status!='pending'?ReviewEvent(item):AuditEvent(item)">
                        <i class="bi bi-lg bi-clipboard-check" :class="item.status!='pending'?'text-muted':'text-primary'" />
                    </span>
                </td>
            </tr>
        </SortableTable>
        <Pagination :search="search" :total="TotalNum" @reload="RefreshContents" />
        <AuditEvent v-if="Dialogs.AuditEvent" :dismiss="CloseDialogs" :Done="RefreshContents" :uuid="ActionProto" />
        <ReviewEvent v-else-if="Dialogs.ReviewEvent" :dismiss="CloseDialogs" :Done="false" :uuid="ActionProto" />
        <template v-else />
    </div>
</template>
<script>
    const AuditStatus = {
        'pending': 'secondary',
        'expired': 'dark',
        'reject': 'danger',
        'permit': 'success',
        'failed': 'warning',
    }
    let SiteMenus
    export default {
        components: {
            AuditEvent: () => import('./helper/event-audit'),
            ReviewEvent: () => import('./helper/event-review'),
        },
        filters: {
            badge(val) {
                return 'bg-' + AuditStatus[val]
            },
            color(val) {
                return {
                    'Update': 'alert-warning',
                    'Create': 'alert-success',
                    'Delete': 'alert-danger',
                } [val]
            }
        },
        data() {
            return {
                showFilter: false,
                search: { sk: '', sv: '', status: [], page: 1, limit: 20 },
                labels: ['user_ip', 'username', 'rolename', 'auditor', 'audit_ip', 'subject'],
                Filters: Object.keys(AuditStatus),
                Status: [],
                Columns: [
                    { sort: 'number', field: 'create_at' },
                    { sort: 'number', field: 'user_ip' },
                    { sort: 'string', field: 'username' },
                    { sort: 'string', field: 'rolename' },
                    { sort: 'amount', field: 'subject' },
                    { sort: 'string', field: 'method' },
                    { sort: 'string', field: 'relate' },
                    { sort: 'number', field: 'audit_at' },
                    { sort: 'number', field: 'audit_ip' },
                    { sort: 'string', field: 'auditor' },
                    { sort: 'number', field: 'status' },
                    { sort: 'string', field: 'reason' },
                ],
                Contents: [],
                TotalNum: 0,
                ActionProto: false,
                Dialogs: {
                    AuditEvent: false,
                    ReviewEvent: false
                }
            }
        },
        computed: {
            i18n: () => i18n,
            method: () => method,
        },
        created() {
            this.search.sk = this.labels[0]
            SiteMenus = this.Helper.Menus
            this.RefreshContents()
        },
        methods: {
            RefreshContents() {
                this.CloseDialogs()
                this.showFilter = this.Status.length
                this.search.status = this.Status
                this.request('System/ListEvents', this.search).resolve(success => {
                    this.TotalNum = success.total
                    this.Contents = success.lists.map(item => {
                        let { menu_id = '', navi_id = '' } = SiteMenus[item.relate] || {}
                        item.relate = [this.translate(menu_id, 'menu'), this.translate(navi_id, 'navi')].join(' / ')
                        return item
                    })
                })
            },
            AuditEvent(item) {
                this.Dialogs.AuditEvent = true
                this.ActionProto = item.uuid
            },
            ReviewEvent(item) {
                this.Dialogs.ReviewEvent = true
                this.ActionProto = item.uuid
            },
            FilterStatus(status) {
                this.Status = this.Status.includes(status) ? this.Status.filter(i => i != status) : [...this.Status, status]
                this.RefreshContents()
            },
            CloseDialogs() {
                this.ActionProto = false
                for (let name in this.Dialogs) {
                    this.Dialogs[name] = false
                }
            }
        }
    }
    let method = {
        'Update': {
            cn: '更新'
        },
        'Create': {
            cn: '创建'
        },
        'Delete': {
            cn: '删除'
        },
    }
    let i18n = {
        'create_at': {
            en: 'Trigger Time',
            cn: '触发时间'
        },
        'username': {
            en: 'Operator',
            cn: '操作者'
        },
        'rolename': {
            en: 'Role',
            cn: '角色名'
        },
        'user_ip': {
            en: 'Operation IP',
            cn: '操作端 IP'
        },
        'relate': {
            en: 'Request Page',
            cn: '请求页面'
        },
        'method': {
            en: 'Request Method',
            cn: '请求方式'
        },
        'subject': {
            en: 'Trigger Action',
            cn: '触发动作'
        },
        'auditor': {
            en: 'Reviewer',
            cn: '审核人'
        },
        'audit_at': {
            en: 'Audit Time',
            cn: '审核时间'
        },
        'audit_ip': {
            en: 'Audit IP',
            cn: '审核端 IP'
        },
        'status': {
            en: 'Audit Result',
            cn: '审核结果'
        },
        'reason': {
            en: 'Reject Reason',
            cn: '驳回原因'
        },
        'pending': {
            en: 'Pending',
            cn: '待处理'
        },
        'expired': {
            en: 'Overdue',
            cn: '逾期'
        },
        'reject': {
            en: 'Rejected',
            cn: '驳回'
        },
        'permit': {
            en: 'Permited',
            cn: '通过'
        },
        'failed': {
            en: 'Execution Failed',
            cn: '执行失败'
        },
    }
</script>
