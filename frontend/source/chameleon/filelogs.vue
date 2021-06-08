<template>
    <div>
        <Navigation>
            <div class="btn-group">
                <button type="button" class="btn btn-sm btn-secondary dropdown-toggle">{{'Filter'|i18n(i18n)}}</button>
                <div class="dropdown-menu end-0">
                    <a class="dropdown-item" :class="{active:!filter}" @click="Filter()">{{'All'|i18n(i18n)}}</a>
                    <a class="dropdown-item" :class="{active:filter=='I'}" @click="Filter('I')">{{'Info'|i18n(i18n)}}</a>
                    <a class="dropdown-item" :class="{active:filter=='W'}" @click="Filter('W')">{{'Warn'|i18n(i18n)}}</a>
                    <a class="dropdown-item" :class="{active:filter=='E'}" @click="Filter('E')">{{'Error'|i18n(i18n)}}</a>
                    <a class="dropdown-item" :class="{active:filter=='D'}" @click="Filter('D')">{{'Debug'|i18n(i18n)}}</a>
                </div>
            </div>
            <button type="button" class="btn btn-sm btn-secondary ms-2" @click="Download"><i class="bi bi-file-earmark-excel" /> {{'Export'|i18n(i18n)}}</button>
        </Navigation>
        <samp class="bg-dark text-light rounded-1 p-2">
            <div v-for="([a,b,c], id) in context" :key="id">
                <span v-if="c" :class="c">{{a}}</span><template v-else /><span :class="{'pl-5':!c}">{{b}}</span>
            </div>
        </samp>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                filter: '',
                Contents: []
            }
        },
        computed: {
            i18n: () => i18n,
            context() {
                let lastState = false,
                    { filter, Contents } = this
                return !filter ? Contents : Contents.filter(([a]) => {
                    if (a && a[0] == filter) {
                        lastState = true
                    } else if (a) {
                        lastState = false
                    }
                    return lastState
                })
            }
        },
        created() {
            this.request('System/ListFileLogs', {}).resolve(success => {
                let KeyWord = 'IWED',
                    KeyClass = { I: 'text-info', W: 'text-warning', E: 'text-danger', D: 'text-white-50' }
                this.Contents = success.split('\n').map(line => {
                    if (KeyWord.includes(line[0])) {
                        return [line.substr(0, 37), line.substr(37), KeyClass[line[0]]]
                    } else {
                        return [false, line]
                    }
                })
            })
        },
        methods: {
            Download() {
                this.request('System/ExportFileLogs', {})
            },
            Filter(condition) {
                this.filter = condition || ''
            }
        }
    }
    let i18n = {
        'Export': {
            cn: '导出',
        },
        'Filter': {
            cn: '筛选',
        },
        'All': {
            cn: '所有',
        },
        'Info': {
            cn: '信息',
        },
        'Warn': {
            cn: '警告',
        },
        'Error': {
            cn: '错误',
        },
        'Debug': {
            cn: '调试',
        },
    }
</script>
