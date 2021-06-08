<template>
    <form id="LoginPassword" v-escape="clearState" class="card max-w50" autocomplete="off" @submit.prevent="doRegister">
        <div class="card-header text-center">{{'Register new account'|i18n(i18n)}} - {{Product.title}}<button type="button" class="btn-close btn-close-white float-end" @click="clearState" /></div>
        <div class="card-body">
            <label class="form-label-group">
                <i class="bi bi-person-circle bg-primary" />
                <input v-model="username" type="text" :disabled="lockForm" class="form-control" :class="{'is-invalid':tips.username,'is-valid':WaitToken}" :readonly="WaitToken" :placeholder="'tip-account'|i18n(i18n)" @blur="validator.check('username')">
                <span class="invalid-feedback">{{tips.username|i18n(i18n)}}</span>
            </label>
            <label class="form-label-group">
                <i class="bi bi-key-fill bg-primary" />
                <input v-model="password" type="password" :disabled="lockForm" class="form-control" :class="{'is-invalid':tips.password,'is-valid':WaitToken}" :readonly="WaitToken" :placeholder="'tip-password'|i18n(i18n)" @blur="validator.check('password')">
                <span class="invalid-feedback">{{tips.password|i18n(i18n)}}</span>
            </label>
            <label class="form-label-group">
                <i class="bi bi-envelope bg-primary" />
                <input v-model="email" type="text" :disabled="lockForm" class="form-control" :class="{'is-invalid':tips.email,'is-valid':WaitToken}" :readonly="WaitToken" :placeholder="'tip-email'|i18n(i18n)" @blur="validator.check('email')">
                <span class="invalid-feedback">{{tips.email|i18n(i18n)}}</span>
            </label>
            <label v-if="Rules.idcard" class="form-label-group">
                <i class="bi bi-credit-card-2-front bg-primary" />
                <input v-model="idcard" type="text" :disabled="lockForm" class="form-control" :class="{'is-invalid':tips.idcard,'is-valid':WaitToken}" :readonly="WaitToken" :placeholder="'tip-idcard'|i18n(i18n)" @blur="validator.check('idcard')">
                <span class="invalid-feedback">{{tips.idcard|i18n(i18n)}}</span>
            </label><template v-else />
            <label v-if="Rules.mobile" class="form-label-group">
                <i class="bi bi-phone bg-primary" />
                <input v-model="mobile" type="text" :disabled="lockForm" class="form-control" :class="{'is-invalid':tips.mobile,'is-valid':WaitToken}" :readonly="WaitToken" :placeholder="'tip-mobile'|i18n(i18n)" @blur="validator.check('mobile')">
                <span class="invalid-feedback">{{tips.mobile|i18n(i18n)}}</span>
            </label><template v-else />
            <label v-if="Rules.realname" class="form-label-group">
                <i class="bi bi-person-bounding-box bg-primary" />
                <input v-model="realname" type="text" :disabled="lockForm" class="form-control" :class="{'is-invalid':tips.realname,'is-valid':WaitToken}" :readonly="WaitToken" :placeholder="'tip-realname'|i18n(i18n)" @blur="validator.check('realname')">
                <span class="invalid-feedback">{{tips.realname|i18n(i18n)}}</span>
            </label><template v-else />
            <label class="form-label-group text-nowrap">
                <i class="bi bi-puzzle-fill bg-primary" />
                <input v-model="token" type="text" :disabled="!WaitToken" class="form-control" :class="{'is-invalid':tips.token}" :placeholder="'tip-token'|i18n(i18n)" @blur="validator.check('token')">
                <button type="button" :disabled="lockForm" class="btn btn-primary ms-3 px-4 d-inline-flex align-items-center" @click="doAction">{{'Send verification email'|i18n(i18n)}}</button>
                <span class="invalid-feedback">{{tips.token|i18n(i18n)}}</span>
            </label>
            <div class="row">
                <div class="col-6">
                    <button type="button" class="btn btn-secondary form-control" @click="clearState">{{'back-to-login'|i18n(i18n)}}</button>
                </div>
                <div class="col-6">
                    <button type="submit" :disabled="!token" class="btn btn-success form-control ml-0" :class="{disabled:validator.errors,shake}">{{'Register new account'|i18n(i18n)}}</button>
                </div>
            </div>
        </div>
        <div class="card-footer text-center">Copyright &copy; {{Product.copyright|ccyear}}</div>
        <Puzzle v-if="showPuzzle" :Done="doRegister" :dismiss="CancelPuzzle" /><template v-else />
    </form>
</template>
<script>
    export default {
        props: {
            clearState: {
                type: Function,
                required: true
            }
        },
        data() {
            return {
                lockForm: false,
                username: '',
                password: '',
                email: '',
                idcard: '',
                mobile: '',
                realname: '',
                token: '',
                shake: false,
                WaitToken: false,
                showPuzzle: false,
            }
        },
        computed: {
            i18n: () => i18n,
            tips() {
                return this.validator.tips
            },
            Product() {
                return this.Helper.Product
            },
        },
        created() {
            const {
                pass_filter_weak,
                pass_weak_define,

                pass_max_sequence,
                pass_key_sequence,

                pass_max_repeat,
                pass_min_length,
                pass_min_types,

                account_realname,
                account_mobile,
                account_idcard
            } = this.Helper.Rules
            const Rules = {
                username: [
                    ['noempty', i18n, 'tip-account-empty'],
                    ['length', [6], i18n, 'tip-account-length'],
                ],
                password: [
                    ['noempty', i18n, 'tip-password-empty'],
                    [v => this.username && v.includes(this.username), i18n, 'tip-password-invalid'],
                ],
                email: [
                    ['noempty', i18n, 'tip-email-empty'],
                    ['email', i18n, 'tip-email-invalid']
                ],
                token: ['noempty', i18n, 'tip-token-empty', this.WaitToken]
            }
            // 最短长度
            pass_min_length && Rules.password.push(['length', [pass_min_length]])
            // 过滤弱密码
            pass_weak_define && pass_filter_weak && Rules.password.push(['pass_filter_weak', [pass_weak_define]])
            // 过滤联系键位字符
            pass_max_sequence && Rules.password.push(['pass_max_sequence', [pass_max_sequence, pass_key_sequence]])
            // 过滤重复字符
            pass_max_repeat && Rules.password.push(['pass_max_repeat', [pass_max_repeat]])
            // 强制字符类型
            pass_min_types && Rules.password.push(['pass_min_types', [pass_min_types]])

            account_mobile == 'Required' ? Rules.mobile = ['mobile'] : null
            account_idcard == 'Required' ? Rules.idcard = ['idcard'] : null
            account_realname == 'Required' ? Rules.realname = ['realname'] : null
            this.Rules = Rules
            this.validator.register(this, this.$data, () => Rules)
        },
        methods: {
            PuzzleCheck() {
                if (this.validator.check()) {
                    return false
                }
                this.showPuzzle = true
            },
            doAction() {
                this.PuzzleCheck()
            },
            CancelPuzzle() {
                this.showPuzzle = false
            },
            doRegister() {
                this.showPuzzle = false
                const { username, password, realname, idcard, mobile, email, token } = this
                this.request('Account/Register', { username, password, realname, idcard, mobile, email, token }).resolve(success => {
                    if (success === true) {
                        this.WaitToken = true
                        this.lockForm = true
                    } else {
                        this.clearState()
                    }
                }).reject(error => {
                    if (error.startsWith('username:')) {
                        this.tips.username = 'tip-account-duplicate'
                    } else if (error.startsWith('email:')) {
                        this.tips.email = 'tip-email-duplicate'
                    } else if (error.startsWith('token:')) {
                        this.tips.token = 'tip-token-invalid'
                        this.WaitToken = false
                        this.lockForm = false
                        this.token = ''
                    } else {
                        return error
                    }
                })
            },
        }
    }
    let i18n = {
        'Register new account': {
            cn: '注册账号'
        },
        'tip-account': {
            en: 'Login account, can not be changed after registration',
            cn: '登录账号，注册后不可变更'
        },
        'tip-password': {
            en: 'Please set login password',
            cn: '请设置登录密码'
        },
        'tip-email': {
            en: 'Email address, which can be used to retrieve password',
            cn: '邮箱地址，可用于找回密码'
        },
        'tip-idcard': {
            en: '18-digit resident ID number',
            cn: '18位居民身份证号码'
        },
        'tip-mobile': {
            en: '11-digit mobile number',
            cn: '11位手机号码'
        },
        'tip-realname': {
            en: 'Your Chinese name',
            cn: '您的中文姓名'
        },
        'tip-token': {
            en: 'Please fill in the registration verification code in the email',
            cn: '请填写邮件中的注册验证码'
        },
        'Send verification email': {
            cn: '发送验证邮件'
        },
        'back-to-login': {
            en: 'Already have an account, return to login',
            cn: '已有账号，返回登录'
        },
        'tip-account-empty': {
            en: 'Login account cannot be empty',
            cn: '登录账号不能为空'
        },
        'tip-account-length': {
            en: 'The shortest account name is 6 letters',
            cn: '账户名称最短 6 个字母'
        },
        'tip-account-duplicate': {
            en: 'The account name has been used by others, please change',
            cn: '账户名称已被他人使用，请更换'
        },

        'tip-password-empty': {
            en: 'Login password cannot be empty',
            cn: '登录密码不能为空'
        },
        'tip-password-invalid': {
            en: 'Prohibit including account name',
            cn: '禁止包含帐户名称'
        },

        'tip-email-empty': {
            en: 'Email address cannot be empty',
            cn: '邮箱地址不能为空'
        },
        'tip-email-invalid': {
            en: 'Please confirm the email address format is correct',
            cn: '请确认邮箱地址格式正确'
        },
        'tip-email-duplicate': {
            en: 'Email address has been used by others, please change',
            cn: '邮件地址已被他人使用，请更换'
        },

        'tip-token-empty': {
            en: 'verification code must be filled',
            cn: '验证码不能为空'
        },
        'tip-token-invalid': {
            en: 'Invalid verification code, please confirm or apply again',
            cn: '无效验证码，请确认或重新申请'
        },
    }
</script>
