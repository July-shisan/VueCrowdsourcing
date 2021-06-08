<template>
    <div>
        <Navigation />
        <div v-if="needSave" class="sticky-top ms-auto">
            <button class="btn btn-danger mb-3" @click="CommitChanges">{{'Commit Auditing'|i18n(i18n)}}</button>
        </div><template v-else />
        <SortableTable :Columns="Columns" :Contents="Contents" :i18n="'siterules'">
            <th slot="append" class="text-center w-1">{{'Action'|i18n}}</th>
            <tr v-for="item in Contents" :key="item.name" :class="{'table-warning':Changed(item.name)}">
                <td class="text-wrap">
                    <span>{{item.name|i18n('siterules')}}</span>
                    <pre class="small text-muted">{{('Describe: ' + item.name)|i18n('siterules')}}</pre>
                    <template v-if="item.depends">
                        <small class="text-primary">{{'Depends On'|i18n('siterules')}}</small>
                        <ul class="small">
                            <li v-for="rule in item.depends" :key="rule">{{rule|i18n('siterules')}}</li>
                        </ul>
                    </template><template v-else />
                </td>
                <td>
                    <ul v-if="item.type=='radio'" class="list-group list-group-horizontal">
                        <li v-for="value in item.options" :key="value" class="small list-group-item list-group-item-secondary py-2" :class="{active:value==item.value}">{{value|i18n('siterules')}}</li>
                    </ul>
                    <template v-else-if="item.type=='boolean'">
                        <i class="bi bi-lg" :class="item.value?'bi-toggle-on text-success':'bi-toggle-off text-danger'" />
                        <small class="text-muted">{{item.value?'Enabled':'Disabled'|i18n('siterules')}}</small>
                    </template>
                    <small v-else-if="!item.value" class="text-muted">{{'Not Config'|i18n('siterules')}}</small>
                    <span v-else-if="item.type=='text'" class="text-primary">{{item.value||'-'|shorten}}</span>
                    <div v-else-if="item.name=='_email_server'" class="list-group-flush m-n2">
                        <div class="list-group-item">{{'selfCa'|i18n(i18n)}}: <i class="bi bi-lg" :class="item.value.selfCa?'bi-toggle-on text-primary':'bi-toggle-off text-muted'" /></div>
                        <div class="list-group-item">{{'STARTTLS'|i18n(i18n)}}: <i class="bi bi-lg" :class="item.value.STARTTLS?'bi-toggle-on text-primary':'bi-toggle-off'" /></div>
                        <div class="list-group-item">{{'host'|i18n(i18n)}}: <span class="text-primary">{{item.value.host}}</span></div>
                        <div class="list-group-item">{{'port'|i18n(i18n)}}: <span class="text-primary">{{item.value.port}}</span></div>
                        <div class="list-group-item">{{'from'|i18n(i18n)}}: <span class="text-primary">{{item.value.from}}</span></div>
                        <div class="list-group-item">{{'alert_to'|i18n(i18n)}}: <span class="text-primary">{{item.value.alert_to}}</span></div>
                    </div>
                    <template v-else>
                        <span class="text-primary">{{item.value}}</span>
                        <small class="text-muted">{{item.unit|i18n('siterules')}}</small>
                    </template>
                </td>
                <td class="text-center text-primary">
                    <span role="button" @click="ModifySetting(item)">
                        <i class="bi bi-sliders" />
                    </span>
                </td>
            </tr>
        </SortableTable>
        <PopWindow v-if="Dialogs.ModifySetting" v-escape="CloseDialogs" :dismiss="CloseDialogs" :Done="Dialogs.ModifySetting" :btnConfig="{checker}">
            <template #title>{{ActionProto.name|i18n('siterules')}}</template>
            <div class="form-group">
                <pre class="text-wrap">{{('Describe: ' + ActionProto.name)|i18n('siterules')}}</pre>
                <small class="text-muted">{{ActionProto.args.join('~')}} {{ActionProto.unit|i18n('siterules')}}</small>
                <div v-if="ActionProto.type=='number'" class="input-group">
                    <input v-model.number="ActionProto.value" class="form-control" :class="{'is-invalid':tips.value}" @blur="checker.check('value')">
                    <span v-if="ActionProto.unit" class="input-group-text">{{ActionProto.unit|i18n('siterules')}}</span><template v-else />
                </div>
                <div v-else-if="ActionProto.type=='string'" class="input-group">
                    <input v-model.trim="ActionProto.value" class="form-control" :class="{'is-invalid':tips.value}" @blur="checker.check('value')">
                    <span v-if="ActionProto.unit" class="input-group-text">{{ActionProto.unit|i18n('siterules')}}</span><template v-else />
                </div>
                <div v-else-if="ActionProto.type=='text'" class="input-group">
                    <textarea v-model.trim="ActionProto.value" class="form-control" :class="{'is-invalid':tips.value}" @blur="checker.check('value')" />
                </div>
                <ul v-else-if="ActionProto.type=='radio'" class="list-group list-group-horizontal my-3 text-center">
                    <li v-for="value in ActionProto.options" :key="value" role="button" class="list-group-item list-group-item-action" :class="{active:value==ActionProto.value}" @click="ActionProto.value=value">{{value|i18n('siterules')}}</li>
                </ul>
                <div v-else-if="ActionProto.type=='boolean'" class="input-group">
                    <div class="btn-group mx-auto my-3">
                        <span class="min-w10 btn btn-outline-success" :class="{active:ActionProto.value}" @click="ActionProto.value=true">{{'Enabled'|i18n('siterules')}}</span>
                        <span class="min-w10 btn btn-outline-danger" :class="{active:!ActionProto.value}" @click="ActionProto.value=false">{{'Disabled'|i18n('siterules')}}</span>
                    </div>
                </div>
                <template v-else />
                <span class="invalid-feedback d-block">{{tips.value}}</span>
                <template v-if="ActionProto.depends">
                    <small class="text-primary">{{'Depends On'|i18n('siterules')}}</small>
                    <ul class="small">
                        <li v-for="rule in ActionProto.depends" :key="rule">{{rule|i18n('siterules')}}</li>
                    </ul>
                </template><template v-else />
                <div class="small text-primary text-end fst-italic">{{'The changed settings will not take effect immediately for the logged in user.'|i18n('siterules')}}</div>
            </div>
        </PopWindow>
        <PopWindow v-else-if="Dialogs.MailServer" v-escape="CloseDialogs" :dismiss="CloseDialogs" :Done="Dialogs.MailServer" :btnConfig="{checker}" :VerifyPassword="true">
            <template #title>{{'Mail server settings'|i18n(i18n)}}</template>
            <div class="row mb-3">
                <div class="col-8">
                    <input v-model="ActionProto.selfCa" type="checkbox" class="d-none">
                    <label role="button" data-bs-toggle="tooltip" :title="'tip-ca'|i18n(i18n)" @click="ActionProto.selfCa=!ActionProto.selfCa">
                        <span>{{'selfCa'|i18n(i18n)}}</span>
                        <i class="bi bi-lg" :class="ActionProto.selfCa?'bi-toggle-on text-success':'bi-toggle-off text-secondary'" />
                    </label>
                </div>
                <div class="col">
                    <input v-model="ActionProto.STARTTLS" type="checkbox" class="d-none">
                    <label role="button" data-bs-toggle="tooltip" :title="'tip-tls'|i18n(i18n)" @click="ActionProto.STARTTLS=!ActionProto.STARTTLS">
                        <span>{{'STARTTLS'|i18n(i18n)}}</span>
                        <i class="bi bi-lg" :class="ActionProto.STARTTLS?'bi-toggle-on text-success':'bi-toggle-off text-secondary'" />
                    </label>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-8">
                    <label class="form-label">{{'host'|i18n(i18n)}}</label>
                    <div class="d-inline-block position-relative">
                        <span class="dropdown-toggle text-primary" role="button"><i class="bi bi-cloud-fill" /></span>
                        <div class="dropdown-menu dropdown-menu-dark">
                            <a class="dropdown-item" @click="Predefine('Office')">Office 365</a>
                            <a class="dropdown-item" @click="Predefine('ZohoTLS')">Zoho TLS</a>
                            <a class="dropdown-item" @click="Predefine('ZohoSSL')">Zoho SSL</a>
                            <a class="dropdown-item" @click="Predefine('Tencent')">腾讯企业邮</a>
                            <a class="dropdown-item" @click="Predefine('NetNase')">网易邮箱</a>
                            <a class="dropdown-item" @click="Predefine('none')">Custom</a>
                        </div>
                    </div>
                    <input v-model.trim="ActionProto.host" type="text" class="form-control" :class="{'is-invalid':tips.host}" placeholder="smtp.mail.server.com" @blur="checker.check('host')">
                    <span class="invalid-feedback">{{tips.host}}</span>
                </div>
                <div class="col">
                    <label class="form-label">{{'port'|i18n(i18n)}}</label>
                    <input v-model.number="ActionProto.port" type="text" class="form-control" :class="{'is-invalid':tips.port}" :placeholder="'tip-port'|i18n(i18n)" @blur="checker.check('port')">
                    <span class="invalid-feedback">{{tips.port}}</span>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-8">
                    <label class="form-label">{{'user'|i18n(i18n)}}</label>
                    <input v-model.trim="ActionProto.user" type="text" class="form-control" :class="{'is-invalid':tips.user}" :placeholder="'tip-username'|i18n(i18n)" @blur="checker.check('user')">
                    <span class="invalid-feedback">{{tips.user}}</span>
                </div>
                <div class="col">
                    <label class="form-label">{{'pass'|i18n(i18n)}}</label>
                    <input v-model="ActionProto.pass" type="password" class="form-control" :class="{'is-invalid':tips.pass}" :placeholder="'tip-password'|i18n(i18n)" @blur="checker.check('pass')">
                    <span class="invalid-feedback">{{tips.pass}}</span>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <label class="form-label">{{'from'|i18n(i18n)}}</label>
                    <input v-model.trim="ActionProto.from" type="text" class="form-control" :class="{'is-invalid':tips.from}" placeholder="&quot;张三&quot; <sender@email.server.com>" @blur="checker.check('from')">
                    <span class="invalid-feedback">{{tips.from}}</span>
                </div>
                <div class="col">
                    <label class="form-label">{{'alert_to'|i18n(i18n)}}</label>
                    <input v-model.trim="ActionProto.alert_to" type="text" class="form-control" :class="{'is-invalid':tips.alert_to}" placeholder="&quot;李四&quot; <alert_to@email.server.com>" @blur="checker.check('alert_to')">
                    <span class="invalid-feedback">{{tips.alert_to}}</span>
                </div>
            </div>
        </PopWindow>
        <PopWindow v-else-if="Dialogs.CommitChanges" v-escape="CloseDialogs" :dismiss="CloseDialogs" :Done="Dialogs.CommitChanges" :VerifyPassword="!Dialogs.LeavePage" :btnConfig="{class:Dialogs.LeavePage?'btn-danger':'btn-primary'}">
            <template #title>{{Dialogs.LeavePage?'tip-title-leave':'tip-title-save'|i18n(i18n)}}</template>
            <template #button>{{Dialogs.LeavePage?'Leave Page':'Commit Auditing'|i18n(i18n)}}</template>
            <table class="table table-warning table-bordered">
                <thead class="text-center">
                    <tr>
                        <th>{{'name'|i18n('siterules')}}</th>
                        <th>{{'preset'|i18n('siterules')}}</th>
                        <th>{{'changed'|i18n('siterules')}}</th>
                    </tr>
                </thead>
                <tbody class="th-right">
                    <tr v-for="item in ChangedRules" :key="item.name">
                        <th>{{item.name|i18n('siterules')}}：</th>
                        <template v-if="item.type=='boolean'">
                            <td class="text-muted">{{item.preset?'Enabled':'Disabled'|i18n('siterules')}}</td>
                            <td class="text-primary">{{item.changed?'Enabled':'Disabled'|i18n('siterules')}}</td>
                        </template>
                        <template v-else-if="item.type=='radio'">
                            <td class="text-muted">{{item.preset|i18n('siterules')}}</td>
                            <td class="text-primary">{{item.changed|i18n('siterules')}}</td>
                        </template>
                        <template v-else-if="item.type=='text'">
                            <td class="text-muted">{{item.preset|shorten}}</td>
                            <td class="text-primary">{{item.changed|shorten}}</td>
                        </template>
                        <template v-else>
                            <td class="text-muted">{{item.preset|i18n('siterules')}} {{item.unit|i18n('siterules')}}</td>
                            <td class="text-primary">{{item.changed|i18n('siterules')}} {{item.unit|i18n('siterules')}}</td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </PopWindow><template v-else />
    </div>
</template>
<script>
    export default {
        filters: {
            shorten(val) {
                return isProto(val, 'String') && val.length > 20 ? val.substr(0, 20) + ' ...' : val
            },
        },
        beforeRouteLeave(to, from, next) {
            if (this.needSave) {
                this.Dialogs.LeavePage = true
                this.Dialogs.CommitChanges = next
            } else {
                next()
            }
        },
        data() {
            return {
                Columns: [
                    { sort: false, field: 'name' },
                    { sort: false, field: 'value', class: 'min-w10' },
                ],
                Rules: {},
                Presets: {},
                Settings: {},
                ActionProto: false,
                checker: {},
                Dialogs: {
                    ModifySetting: false,
                    CommitChanges: false,
                    MailServer: false,
                    LeavePage: false,
                },
            }
        },
        computed: {
            i18n: () => i18n,
            tips() {
                return this.checker.tips
            },
            Contents() {
                let { Presets, Rules, Settings } = this
                return Object.keys(Presets).reduce((rtn, name) => {
                    let config = Settings[name],
                        preset = Presets[name]
                    return [...rtn, { name, value: config != undefined ? config : preset, ...Rules[name] }]
                }, [])
            },
            ChangedRules() {
                let { Presets, Rules, Settings } = this
                return Object.keys(Settings).reduce((rtn, name) => {
                    let preset = Presets[name],
                        changed = Settings[name]
                    preset == changed || rtn.push({ name, ...Rules[name], preset, changed })
                    return rtn
                }, [])
            },
            needSave() {
                return Object.keys(this.ChangedRules).length > 0
            },
        },
        created() {
            this.RefreshContents()
            window.addEventListener('beforeunload', this.beforeUnload)
        },
        beforeDestroy() {
            window.removeEventListener('beforeunload', this.beforeUnload)
        },
        methods: {
            beforeUnload(e) {
                if (this.needSave) {
                    e.returnValue = this.lang == 'cn' ? '确定离开当前页面吗？' : 'Are you sure to leave the current page?'
                }
            },
            Changed(name) {
                return this.ChangedRules.some(item => item.name == name)
            },
            RefreshContents() {
                this.CloseDialogs()
                this.Settings = {}
                this.request('System/ListRules', {}).resolve(success => {
                    this.Rules = { ...success.rules }
                    this.Presets = { ...success.preset }
                })
            },
            ModifySetting({ rule, args = [], force = false, ...item }) {
                if (!item.external) {
                    this.ActionProto = { args, ...item }
                    this.checker = this.validator.clone().register(this, this.ActionProto, () => ({ value: [rule, args, force] }))
                    this.Dialogs.ModifySetting = noop => {
                        const { name, value } = this.ActionProto
                        this.Settings = { ...this.Settings, [name]: value }
                        this.CloseDialogs()
                    }
                } else if (item.name == '_email_server') {
                    let { selfCa = false, STARTTLS = false, host = '', port = '', user = '', from = '', alert_to = '' } = item.value || {}
                    this.ActionProto = { selfCa, STARTTLS, host, port, user, pass: '', from, alert_to }
                    this.checker = this.validator.clone().register(this, this.ActionProto, () => ({
                        host: ['domain'],
                        port: ['integer', [0, 65535], false],
                        user: ['noempty'],
                        pass: ['noempty'],
                        from: ['noempty'],
                        alert_to: ['noempty'],
                    }))
                    this.Dialogs.MailServer = VerifyPassword => {
                        const EventSubmit = {
                            subject: '邮件服务器设置',
                            i18n:{ ...i18n, password: { cn: '密码', en: 'Password' } }
                        }, { port, ...params } = this.ActionProto
                        this.request('System/ChangeMailServer', {
                            port: port || 465,
                            ...params,
                            VerifyPassword,
                            EventSubmit
                        }).resolve(this.RefreshContents)
                    }
                } else {
                    this.checker = false
                }
            },
            Predefine(type) {
                let Config = {
                    Tencent: {
                        selfCa: false,
                        STARTTLS: false,
                        host: 'smtp.exmail.qq.com',
                        port: 465
                    },
                    NetNase: {
                        selfCa: false,
                        STARTTLS: false,
                        host: 'smtp.163.com',
                        port: 465
                    },
                    Office: {
                        selfCa: false,
                        STARTTLS: true,
                        host: 'smtp.office365.com',
                        port: 587
                    },
                    ZohoSSL: {
                        selfCa: false,
                        STARTTLS: false,
                        host: 'smtp.zoho.com',
                        port: 465
                    },
                    ZohoTLS: {
                        selfCa: false,
                        STARTTLS: true,
                        host: 'smtp.zoho.com',
                        port: 587
                    } }[type] || {
                    selfCa: false,
                    STARTTLS: false,
                    host :'',
                    port: ''
                }
                Object.assign(this.ActionProto, Config)
            },
            CommitChanges() {
                this.Dialogs.CommitChanges = VerifyPassword => {
                    const params = {},
                          preset = {}
                    this.ChangedRules.map(item => {
                        params[item.name] = item.changed
                        preset[item.name] = item.preset
                    })
                    const EventDetail = {
                        subject: '系统安全设置变更',
                        before: preset,
                        i18n: 'siterules'
                    }
                    this.request('System/UpdateRules', { ...params, VerifyPassword, EventDetail }).resolve(this.RefreshContents)
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
        'Mail server settings': {
            cn: '邮件服务器设置'
        },
        'Commit Auditing': {
            cn: '提交审核'
        },
        'provider': {
            en: 'Service Provider',
            cn: '邮件服务商'
        },
        'selfCa': {
            en: 'Skip certificate verification',
            cn: '跳过证书验证'
        },
        'host': {
            en: 'Mail Server',
            cn: '邮件服务器'
        },
        'port': {
            en: 'Server Port',
            cn: '服务器端口'
        },
        'user': {
            en: 'Authentication Username',
            cn: '认证账户'
        },
        'pass': {
            en: 'Authentication Password',
            cn: '认证密码'
        },
        'from': {
            en: 'Default Sender',
            cn: '默认发件人'
        },
        'alert_to': {
            en: 'Alert recipient',
            cn: '告警接收人'
        },
        'tip-ca': {
            en: 'This option needs to be turned on when the mail server uses a self-signed certificate',
            cn: '邮件服务器使用自签名证书时需要开启此选项'
        },
        'tip-tls': {
            en: 'Mail server certification standards',
            cn: '邮件服务器认证标准'
        },
        'tip-port': {
            en: 'Default port: 465',
            cn: '默认: 465'
        },
        'tip-username': {
            en: 'Authentication account name',
            cn: '认证账户名称'
        },
        'tip-password': {
            en: 'Authentication account password',
            cn: '认证账户密码'
        },
        'tip-title-leave': {
            en:'The following settings have not been submitted for review, confirm to leave?',
            cn:'以下设置尚未提交审核，确认离开？'
        },
        'tip-title-save': {
            en:'The following settings have been modified and are pending submission for review',
            cn:'以下设置已经修改，待提交审核'
        },
        'Leave Page': {
            cn: '离开'
        }
    }
</script>
