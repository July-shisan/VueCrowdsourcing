<template>
    <PopWindow :dismiss="dismiss" :Done="doAction" :btnConfig="{checker:validator,class:ActionProto.id?'':'btn-success'}" :VerifyPassword="true">
        <template #title>{{ActionProto.id?'Modify Account':'Create Account'|i18n(i18n)}}</template>
        <template #button>{{ActionProto.id?'Modify Account':'Create Account'|i18n(i18n)}}</template>
        <div class="mb-3">
            <label class="form-label">{{'username'|i18n(fields)}}</label>
            <span v-if="ActionProto.id" class="form-control bg-light" :class="{'is-invalid':tips.username}">{{Params.username}}</span>
            <input v-else v-model.trim="Params.username" class="form-control" type="text" :class="{'is-invalid':tips.username}" :placeholder="'p-username'|i18n(i18n)" @blur="validator.check('username')">
            <span class="invalid-feedback">{{tips.username|i18n(i18n)}}</span>
        </div>
        <div class="mb-3">
            <label class="form-label">{{'password'|i18n(fields)}} <small class="text-muted">{{'label-simple-password'|i18n(i18n)}}</small></label>
            <input v-model="Params.password" class="form-control" type="text" :class="{'is-invalid':tips.password}" :placeholder="ActionProto.id?'p-password':'p-force-password'|i18n(i18n)" @blur="validator.check('password')">
            <span class="invalid-feedback">{{tips.password}}</span>
        </div>
        <div v-if="AccountExtra['realname']" class="mb-3">
            <label class="form-label">{{'realname'|i18n(fields)}} <small class="text-muted">{{AccountExtra['realname']|i18n(i18n)}}</small></label>
            <input v-model.trim="Params.realname" class="form-control" type="text" :class="{'is-invalid':tips.realname}" :placeholder="'p-realname-usage'|i18n(i18n)" @blur="validator.check('realname')">
            <span class="invalid-feedback">{{tips.realname}}</span>
        </div>
        <div v-if="AccountExtra['email']" class="mb-3">
            <label class="form-label">{{'email'|i18n(fields)}} <small class="text-muted">{{AccountExtra['email']|i18n(i18n)}}</small></label>
            <input v-model.trim="Params.email" class="form-control" type="text" :class="{'is-invalid':tips.email}" :placeholder="'p-email-usage'|i18n(i18n)" @change="lowercase('email')" @blur="validator.check('email')">
            <span class="invalid-feedback">{{tips.email}}</span>
        </div>
        <div v-if="AccountExtra['mobile']" class="mb-3">
            <label class="form-label">{{'mobile'|i18n(fields)}} <small class="text-muted">{{AccountExtra['mobile']|i18n(i18n)}}</small></label>
            <input v-model.trim="Params.mobile" class="form-control" type="text" :class="{'is-invalid':tips.mobile}" :placeholder="'p-mobile-usage'|i18n(i18n)" @blur="validator.check('mobile')">
            <span class="invalid-feedback">{{tips.mobile}}</span>
        </div>
        <div v-if="AccountExtra['idcard']" class="mb-3">
            <label class="form-label">{{'idcard'|i18n(fields)}} <small class="text-muted">{{AccountExtra['idcard']|i18n(i18n)}}</small></label>
            <input v-model.trim="Params.idcard" class="form-control" type="text" :class="{'is-invalid':tips.idcard}" :placeholder="'p-mobile-usage'|i18n(i18n)" @blur="validator.check('idcard')">
            <span class="invalid-feedback">{{tips.idcard}}</span>
        </div>
        <div class="mb-3">
            <label class="form-label">{{'role_id'|i18n(fields)}}</label>
            <small v-if="locked_roles.includes(ActionProto.id)" class="text-muted"><i class="bi bi-lock" /> {{'Role Locked'|i18n(i18n)}}</small>
            <select v-model="Params.role_id" class="form-select" :disabled="locked_roles.includes(ActionProto.id)" :class="{'is-invalid':tips.role_id,'bg-light':ActionProto.lock_assign}" @change="validator.check('role_id')">
                <option v-for="{id, rolename, is_default, is_frozen, lock_assign} in Roles" :key="id" :value="id" :disabled="!!lock_assign">{{rolename}} {{is_frozen?'Disabled':''|i18n(i18n)}} {{lock_assign?'lock_assign':''|i18n(i18n)}} {{is_default?'is_default':''|i18n(i18n)}}</option>
            </select>
            <span class="invalid-feedback">{{tips.role_id}}</span>
        </div>
        <div class="row mb-3">
            <div class="form-group col">
                <label class="form-label">{{'ip_white'|i18n(fields)}}</label>
                <textarea v-model.trim.lazy="Params.ip_white" class="form-control" :class="{'is-invalid':tips.ip_white}" :placeholder="'Optional'|i18n(i18n)" @change="validator.check('ip_white')" />
                <span class="invalid-feedback">{{tips.ip_white}}</span>
            </div>
            <div class="form-group col">
                <label class="form-label">{{'ip_black'|i18n(fields)}}</label>
                <textarea v-model.trim.lazy="Params.ip_black" class="form-control" :class="{'is-invalid':tips.ip_black}" :placeholder="'Optional'|i18n(i18n)" @change="validator.check('ip_black')" />
                <span class="invalid-feedback">{{tips.ip_black}}</span>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">{{'remark'|i18n(fields)}}</label>
            <textarea v-model.trim="Params.remark" class="form-control" :class="{'is-invalid':tips.remark}" :placeholder="'Optional'|i18n(i18n)" @blur="validator.check('remark')" />
            <span class="invalid-feedback">{{tips.remark}}</span>
        </div>
        <div class="mb-3">
            <label class="form-label">{{'lock_login'|i18n(fields)}}</label>
            <label>
                <input v-model="Params.lock_login" type="checkbox" class="d-none">
                <i class="bi bi-lg" :class="Params.lock_login?'bi-toggle-off text-danger':'bi-toggle-on text-success'" />
                <span :class="Params.lock_login?'text-danger':'text-success'">{{Params.lock_login?'Disabled':'Enabled'|i18n(i18n)}}</span>
                <small v-if="Params.lock_login" class="text-muted">{{'When disabled, user will be banned from logging in'|i18n(i18n)}}</small>
            </label>
        </div>
    </PopWindow>
</template>
<script>
    export default {
        props: {
            ActionProto: {
                type: Object,
                default: () => ({})
            },
            Done: {
                type: Function,
                required: true
            },
            dismiss: {
                type: Function,
                required: true
            },
        },
        data() {
            return {
                AccountExtra: {},
                locked_roles: [],
                Params: {},
                Roles: []
            }
        },
        computed: {
            i18n: () => i18n,
            fields: () => fields,
            tips() {
                return this.validator.tips
            },
        },
        created() {
            let { id, username = '', lock_login = false, ip_white = '', ip_black = '', remark = '', email = '', mobile = '', idcard = '', realname = '', role_id } = this.ActionProto
            this.Params = { id, username, password: '', lock_login, ip_white, ip_black, remark, email, mobile, idcard, realname, role_id }
            let Rules = this.BuildRuels()
            this.validator.register(this, this.Params, () => Rules)
            this.LoadRoles()
        },
        methods: {
            BuildRuels() {
                let Rules = {
                    username: ['noempty', 'tip-username', i18n],
                    password: [
                        ['noempty', !this.ActionProto.id, 'tip-password', i18n],
                        ['length', [8], !this.ActionProto.id],
                        [v => this.Params.username && v.includes(this.Params.username), 'Password is prohibited to include account name', i18n]
                    ],
                    role_id: ['integer', [1], 'tip-role', i18n],
                    ip_white: ['iplists', false],
                    ip_black: ['iplists', false],
                    remark: ['length', [null, 128], false],
                }
                let {
                    account_realname,
                    account_email,
                    account_mobile,
                    account_idcard,
                } = this.Helper.Rules
                if (account_email != 'Disabled') {
                    this.AccountExtra['email'] = account_email
                    Rules.email = ['email', account_email != 'Optional']
                }
                if (account_mobile != 'Disabled') {
                    this.AccountExtra['mobile'] = account_mobile
                    Rules.mobile = ['mobile', account_mobile != 'Optional']
                }
                if (account_idcard != 'Disabled') {
                    this.AccountExtra['idcard'] = account_idcard
                    Rules.idcard = ['idcard', account_idcard != 'Optional']
                }
                if (account_realname != 'Disabled') {
                    this.AccountExtra['realname'] = account_realname
                    Rules.realname = ['realname', account_realname != 'Optional']
                }
                return Rules
            },
            LoadRoles() {
                this.request('Account/ListRoles', { limit: false }).resolve(success => {
                    this.Roles = success.lists.map(({ id, rolename, is_default, is_frozen, lock_assign }) => {
                        this.Params.id || lock_assign || is_default && (this.Params.role_id = id)
                        lock_assign && this.locked_roles.push(id)
                        return { id, rolename, is_default, is_frozen, lock_assign }
                    })
                })
            },
            lowercase(key) {
                this.Params[key] = this.Params[key].toLowerCase()
            },
            doAction(VerifyPassword) {
                let { id, username, role_id, ...params } = this.Params
                this.request('Account/ListUsers', { sk: 'username', sv: username }).resolve(success => {
                    if (id && !success.total) {
                        return this.tips.username = 'can\'t find the user'
                    } else if (!id && success.total) {
                        return this.tips.username = 'duplicated username'
                    }
                    const action = id ? 'UpdateUser' : 'CreateUser'
                    const EventDetail = {
                        subject: this.translate(id ? 'Modify Account' : 'Create Account', i18n),
                        dict: { role_id: this.Roles.reduce((rtn, { id, rolename }) => [role_id, this.ActionProto.role_id].includes(id) ? { ...rtn, [id]: rolename } : rtn, {}) },
                        before: id ? this.ActionProto : false,
                        i18n: { ...fields, 'lock_login': { cn: '禁止登录', en: 'Login Prohibited' } }
                    }
                    this.request('Account/' + action, { id, username, role_id, ...params, VerifyPassword, EventDetail }).resolve(this.Done)
                })
            },
        }
    }
    let fields = {
        'username': {
            en: 'Account Name',
            cn: '账户名称'
        },
        'password': {
            en: 'Account Password',
            cn: '登录密码'
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
        'role_id': {
            en: 'Role Name',
            cn: '角色名称'
        },
        'ip_white': {
            en: 'IP Whitelist',
            cn: 'IP白名单'
        },
        'ip_black': {
            en: 'IP Blacklist',
            cn: 'IP黑名单'
        },
        'remark': {
            en: 'Remark',
            cn: '备注'
        },
        'lock_login': {
            en: 'Available',
            cn: '启用状态'
        },
    }
    let i18n = {
        'Create Account': {
            cn: '新建账户'
        },
        'Modify Account': {
            cn: '修改账户'
        },
        'can\'t find the user': {
            cn: '用户未找到，请刷新后重试'
        },
        'duplicated username': {
            cn: '用户名重复，请更换'
        },
        'Enabled': {
            cn: '启用'
        },
        'Disabled': {
            cn: '禁用'
        },
        'When disabled, user will be banned from logging in': {
            cn: '禁用后，将禁止用户登录'
        },
        'Optional': {
            cn: '选填'
        },
        'Required': {
            cn: '必填'
        },
        'p-username': {
            en: 'The account name cannot be modified after created',
            cn: '账户名设置后无法修改'
        },
        'tip-username': {
            en: 'Please set user login name',
            cn: '请设定用户登录名'
        },
        'p-realname-usage': {
            en: 'Please provide the user\'s real name',
            cn: '请提供用户的真实姓名'
        },
        'p-email-usage': {
            en: 'After the mail server is configured correctly, it can be used: reset the password by mail, login two-factor authentication',
            cn: '邮件服务器正确配置后可使用：通过邮件重置密码，登录双重验证'
        },
        'p-mobile-usage': {
            en: 'Emergency contact use',
            cn: '应急联系使用'
        },
        'label-simple-password': {
            en: 'The user is forced to change the password after the first login',
            cn: '简单模式，用户第一次登录后强制更换密码'
        },
        'p-password': {
            en: 'No need to change the password, please leave it blank',
            cn: '无需更改密码，请留空'
        },
        'p-force-password': {
            en: 'Please set the initial login password for the user',
            cn: '请为用户设定初始登录密码'
        },
        'Password is prohibited to include account name': {
            cn: '禁止包含帐户名称'
        },
        'tip-password': {
            en: 'Please set user login password',
            cn: '请设定用户登录密码'
        },
        'tip-role': {
            en: 'Please specify a role for the user',
            cn: '请为用户指定角色'
        },
        'Role Locked': {
            cn: '角色锁定'
        },
        'lock_assign': {
            en: '[Lock Assign]',
            cn: '[锁定/禁止分配]'
        },
        'is_default': {
            en: '[Default Role]',
            cn: '[默认角色]'
        }
    }
</script>
