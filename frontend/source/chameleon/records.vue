<template>
    <div>
        <Navigation />
        <div class="d-flex mb-3">
            <span class="btn btn-outline-primary" @click="RefreshContents"><i class="bi bi-arrow-repeat" /> {{'Refresh'|i18n('button')}}</span>
            <span class="btn btn-outline-secondary" @click="ExportRecords"><i class="bi bi-file-earmark-excel" /> {{'Export'|i18n(i18n)}}</span>
            <span class="btn btn-secondary ms-auto" @click="showFilter=!showFilter"><i class="bi bi-three-dots" /></span>
            <template v-if="showFilter">
                <div class="btn-group ms-2">
                    <template v-for="(v,id) in Object.keys(method)">
                        <span :key="id" class="btn btn-outline-secondary" :class="{active:search.method.includes(v)}" :title="v|i18n(method)" @click="QueryType(v)">
                            <i class="fa" :class="QueryTypes[id]" />
                        </span>
                    </template>
                </div>
                <div class="btn-group ms-2">
                    <template v-for="(v,id) in new Array(QueryResults.length)">
                        <span :key="id" class="btn btn-outline-secondary" :class="{active:search.result.includes(id)}" @click="QueryResult(id)">
                            <i class="fa" :class="QueryResults[id][0]" /> {{!id|i18n(error)}}
                        </span>
                    </template>
                </div>
            </template><template v-else />
            <ContentFilter class="ms-2" :Reload="RefreshContents" :Search="search" :Labels="labels" :i18n="i18n" />
        </div>
        <SortableTable :Columns="Columns" :Contents="Contents" :i18n="i18n">
            <tr v-for="item in Contents" :key="item.id" :class="{'text-danger':item.error}">
                <td>{{item.create_at|datetime}}</td>
                <td>{{item.username}}</td>
                <td>{{item.address}}</td>
                <td>{{item.href}}<br><small class="text-muted">{{item.navi}}</small></td>
                <td class="pre">{{item.params}}</td>
                <td class="pre"><i class="bi" :class="item.error|error" /> {{item.error||"true"|i18n(error)}}</td>
                <td><i class="bi" :class="item.method|method" /> {{item.method|i18n(method)}}</td>
                <td class="pre">{{item.ua}}</td>
            </tr>
            <template #header-6>
                <div class="d-inline-block ps-1 position-relative">
                    <span class="dropdown-toggle text-muted" role="button"><i class="bi bi-filter-circle" /></span>
                    <span class="dropdown-menu">
                        <template v-for="(v,id) in Object.keys(method)">
                            <a :key="id" class="dropdown-item" :class="{active:search.method.includes(v)}" @click="QueryType(v)"><i class="bi" :class="QueryTypes[id]" /> {{v|i18n(method)}}</a>
                        </template>
                    </span>
                </div>
            </template>
        </SortableTable>
        <Pagination :search="search" :total="TotalNum" @reload="RefreshContents" />
    </div>
</template>
<script>
    let QueryTypes = ['bi-list-ol', 'bi-pencil-square', 'bi-plus-lg', 'bi-dash-lg', 'bi-key-fill', 'bi-power', 'bi-inboxes', 'bi-clipboard-check', 'bi-upload', 'bi-download'],
        QueryResults = ['bi-check-lg text-success'.split(' '), 'bi-x-lg text-danger'.split(' ')]
    export default {
        filters: {
            method(val) {
                return QueryTypes[val]
            },
            error(val) {
                return QueryResults[!!val - 0].join(' ')
            }
        },
        data() {
            return {
                showFilter: false,
                search: { sk: '', sv: '', method: [], result: [], page: 1, limit: 10 },
                labels: ['username', 'address', 'href', 'ua'],
                Columns: [
                    { sort: 'number', field: 'create_at' },
                    { sort: 'string', field: 'username' },
                    { sort: 'number', field: 'address' },
                    { sort: 'string', field: 'href' },
                    { sort: false, field: 'params' },
                    { sort: 'string', field: 'error' },
                    { sort: 'string', field: 'method' },
                    { sort: 'string', field: 'ua' }
                ],
                Contents: [],
                TotalNum: 0,
            }
        },
        computed: {
            i18n: () => i18n,
            error: () => error,
            method: () => method,
            QueryTypes: () => QueryTypes,
            QueryResults: () => QueryResults
        },
        created() {
            this.search.sk = this.labels[0]
            this.RefreshContents()
        },
        methods: {
            RefreshContents() {
                let SiteMenus = this.Helper.Menus,
                    { method, result } = this.search
                this.showFilter = method.length || result.length
                this.request('System/ListActions', this.search).resolve(success => {
                    this.Contents = success.lists.map(item => {
                        let { menu_id = '', navi_id = '' } = SiteMenus[item.navi] || {}
                        item.navi = [this.translate(menu_id, 'menu'), this.translate(navi_id, 'navi')].join(' / ')
                        return item
                    })
                    this.TotalNum = success.total
                })
            },
            ExportRecords() {
                this.request('System/ExportActions', {})
            },
            QueryType(method) {
                let methods = this.search.method
                this.search.method = methods.includes(method) ? methods.filter(i => i != method) : [...methods, method]
                this.RefreshContents()
            },
            QueryResult(result) {
                this.search.result = this.search.result.includes(result) ? [] : [result]
                this.RefreshContents()
            }
        }
    }
    let method = {
        'Obtain': {
            en: 'Query',
            cn: '查询'
        },
        'Update': {
            cn: '更新'
        },
        'Create': {
            cn: '创建'
        },
        'Delete': {
            cn: '删除'
        },
        'Login': {
            cn: '登入'
        },
        'Logout': {
            cn: '登出'
        },
        'Submit': {
            cn: '送审'
        },
        'Audit': {
            cn: '审核'
        },
        'Upload': {
            cn: '上传'
        },
        'Download': {
            cn: '下载'
        },
    }

    let error = {
        'true': {
            en: 'Success',
            cn: '成功'
        },
        'false': {
            en: 'Failure',
            cn: '失败'
        }
    }
    let i18n = {
        'create_at': {
            en: 'Record Time',
            cn: '记录时间'
        },
        'username': {
            en: 'Account Name',
            cn: '操作者'
        },
        'address': {
            en: 'IP Address',
            cn: '访问 IP'
        },
        'href': {
            en: 'Request Page',
            cn: '请求页面'
        },
        'params': {
            en: 'Params',
            cn: '参数'
        },
        'method': {
            en: 'Log Type',
            cn: '日志类型'
        },
        'error': {
            en: 'Status',
            cn: '状态'
        },
        'ua': {
            en: 'User Agent',
            cn: '浏览器'
        },
        'Export': {
            cn: '导出',
        },
    }
</script>
