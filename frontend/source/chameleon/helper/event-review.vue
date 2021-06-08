<template>
    <PopWindow :dismiss="dismiss" :Done="Done" :VerifyPassword="Boolean(Done)">
        <template #title>{{"Event Auditing"|i18n(i18n)}}</template>
        <div class="alert" :class="Event.method|color">{{Event.subject}}</div>
        <table class="table table-bordered">
            <caption>
                <span class="badge bg-dark">{{Event.create_at|datetime}}</span>
                <span class="badge bg-info">@</span>
                <span class="badge bg-dark">{{Event.user_ip}}</span>
                <span class="badge bg-info">by</span>
                <span class="badge bg-primary">{{Event.username}}</span>
            </caption>
            <thead>
                <tr>
                    <th class="w-1" />
                    <th v-if="['Update', 'Delete'].includes(Event.method)">{{'Original setting'|i18n(i18n)}}</th><template v-else />
                    <th v-if="['Update', 'Create'].includes(Event.method)">{{'Request change'|i18n(i18n)}}</th><template v-else />
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in Detail" :key="item.name" :class="{'alert-warning':Event.method=='Update'&&item.before!=item.after}">
                    <th class="text-nowrap">{{item.name|i18n(Event.i18n)}}</th>
                    <td v-if="['Update', 'Delete'].includes(Event.method)" class="text-pre">{{item.before||'-'}}</td><template v-else />
                    <td v-if="['Update', 'Create'].includes(Event.method)" class="text-pre">{{item.after||'-'}}</td><template v-else />
                </tr>
            </tbody>
        </table>
        <hr>
        <slot>
            <div class="row">
                <label class="col-auto">{{"Audit Result"|i18n(i18n)}}</label>
                <div class="col">
                    <span class="badge" :class="Event.status|badge">{{Event.status|i18n(i18n)}}</span>
                    <pre v-if="Event.status!='permit'" class="mt-3">{{Event.reason}}</pre><template v-else />
                </div>
            </div>
        </slot>
    </PopWindow>
</template>
<script>
    const AuditStatus = {
        'pending': 'secondary',
        'expired': 'dark',
        'reject': 'danger',
        'permit': 'success',
        'failed': 'warning',
    }
    export default {
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
        props: {
            uuid: {
                type: String,
                required: true
            },
            Done: {
                type: [Boolean, Function],
                default: false
            },
            dismiss: {
                type: Function,
                required: true
            },
        },
        data() {
            return {
                Event: {},
                Detail: [],
            }
        },
        computed: {
            i18n: () => i18n,
        },
        created() {
            this.request('System/ListEvents', { sk: 'uuid', sv: this.uuid }).resolve(success => {
                this.Event = success.lists[0]
                let detail = [],
                    { method } = this.Event,
                    { before, after, i18n, dict = {}, replace = {} } = success.detail
                this.Event.i18n = i18n
                if (method == 'Delete') {
                    for (let name in before) {
                        let value = before[name]
                        name in dict ? value = dict[name][value] : null
                        detail.push({ name, before: value || '' })
                    }
                } else {
                    for (let name in after) {
                        let value = after[name]
                        if (name in replace) {
                            value = replace[name]
                        } else if (name in dict) {
                            value = dict[name][value]
                        }
                        if (before) {
                            let Value = before[name]
                            name in dict ? Value = dict[name][Value] : null
                            detail.push({ name, before: Value || '', after: value || '' })
                        } else {
                            detail.push({ name, after: value })
                        }
                    }
                }
                this.Detail = detail
            })
        }
    }
    let i18n = {
        'Event Auditing': {
            cn: '事件审核'
        },
        'create_at': {
            cn: '触发时间'
        },
        'username': {
            cn: '操作者'
        },
        'Audit Result': {
            cn: '审计结果'
        },
        'reason': {
            cn: '驳回原因'
        },
        'pending': {
            cn: '待处理'
        },
        'expired': {
            cn: '逾期'
        },
        'reject': {
            cn: '驳回'
        },
        'permit': {
            cn: '通过'
        },
        'failed': {
            cn: '执行失败'
        },
        'Original setting': {
            cn: '原始设定'
        },
        'Request change': {
            cn: '请求变更'
        },
    }
</script>
