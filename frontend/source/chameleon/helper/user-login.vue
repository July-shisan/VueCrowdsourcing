<template>
    <div class="pop-mask product" :class="'product-'+Product.pin">
        <Register v-if="FormState=='Register'" :clearState="clearState" />
        <Retrieve v-else-if="FormState=='Retrieve'" :clearState="clearState" />
        <form v-else id="LoginPassword" class="card max-w50" autocomplete="off" @submit.prevent="doAction">
            <div class="card-header text-center">{{'Sign in'|i18n(i18n)}} - {{Product.title}}<button v-if="HomePage" v-escape="cancelLogin" type="button" class="btn-close btn-close-white float-end" @click="cancelLogin" /><template v-else /></div>
            <div class="card-body">
                <label class="form-label-group">
                    <i class="bi bi-person-circle bg-primary" />
                    <input v-model="username" v-focus type="text" :disabled="lockForm" class="form-control" :class="{'is-invalid':tips.username}" :placeholder="'Login account'|i18n(i18n)" @blur="checker.check('username')">
                    <span class="invalid-feedback">{{tips.username|i18n(i18n)}}</span>
                </label>
                <label v-if="WaitToken" class="form-label-group">
                    <i class="bi bi-puzzle bg-primary" />
                    <input v-model="token" type="text" class="form-control" :class="{'is-invalid':tips.token}" :placeholder="'tip-token'|i18n(i18n)" @blur="checker.check('token')">
                    <span class="invalid-feedback">{{tips.token|i18n(i18n)}}</span>
                </label>
                <label v-else class="form-label-group">
                    <i class="bi bg-primary" :class="password?'bi-key':'bi-lock'" />
                    <input v-model="password" type="password" :disabled="lockForm" class="form-control" :class="{'is-invalid':tips.password}" :placeholder="'Login password'|i18n(i18n)" @blur="checker.check('password')">
                    <span class="invalid-feedback">{{tips.password|i18n(i18n)}}</span>
                </label>
                <div v-if="Rules.login_keep_state" class="form-check mb-3">
                    <input id="keep-state" v-model="KeepStat" type="checkbox" class="form-check-input">
                    <label class="form-check-label" for="keep-state">{{'keep-logged-in'|i18n(i18n, ['%n', Rules.login_keep_state])}}</label>
                </div><template v-else />
                <button v-if="Rules.login_keep_state" type="submit" class="btn btn-primary form-control" :class="{disabled:checker.errors,shake}">{{'Confirm login'|i18n(i18n)}}</button>
                <button v-else :disabled="WaitToken&&!token" class="btn btn-primary form-control" :class="{disabled:checker.errors,shake}">{{'Sign in'|i18n(i18n)}}</button>
                <div v-if="Features.length" class="mt-3" :class="{'d-grid grid-col-2':Features.length==2}">
                    <button v-if="Features.includes('register')" type="button" :disabled="lockForm" class="btn btn-success form-control" @click="FormState='Register'">{{'Register a new account'|i18n(i18n)}}</button><template v-else />
                    <button v-if="Features.includes('resetpass')" type="button" :disabled="lockForm" class="btn btn-secondary form-control ml-0" @click="FormState='Retrieve'">{{'Reset password'|i18n(i18n)}}</button><template v-else />
                </div><template v-else />
            </div>
            <div class="card-footer text-center">
                <div>Copyright &copy; {{Product.copyright|ccyear}}</div>
                <div>{{Product.psfn}}</div>
            </div>
            <Puzzle v-if="showPuzzle" :Done="doLogin" :dismiss="cancelLogin" /><template v-else />
        </form>
        <span class="btn btn-light" @click="SwitchLang"><i class="bi bi-translate" /> {{'Switch Language'|i18n(i18n)}}</span>
    </div>
</template>
<script>
    export default {
        components: {
            Register: () => import('./user-register'),
            Retrieve: () => import('./user-passreset'),
        },
        props: {
            HomePage: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                lockForm: false,
                FormState: false,
                username: '',
                password: '',
                token: '',
                shake: false,
                KeepStat: false,
                showPuzzle: false,
                WaitToken: false,
            }
        },
        computed: {
            i18n: () => i18n,
            tips() {
                return this.checker.tips
            },
            Rules() {
                return this.Helper.Rules
            },
            Security() {
                return this.Helper.Security
            },
            Product() {
                return this.Helper.Product
            },
            Features() {
                const feature = [],
                      { MailerEnabled } = this.Helper.Security,
                      { account_register, pass_email_reset } = this.Rules
                MailerEnabled && account_register && feature.push('register')
                MailerEnabled && pass_email_reset && feature.push('resetpass')
                return feature
            }
        },
        created() {
            this.checker = this.validator.clone().register(this, this.$data, () => ({
                username: ['noempty', i18n, 'tip-account-emtpy'],
                password: ['noempty', i18n, 'tip-password-emtpy'],
                token: ['noempty', i18n, 'tip-token-emtpy', this.WaitToken],
            }))
        },
        methods: {
            clearState() {
                this.FormState = false
                this.username = ''
                this.password = ''
                this.token = ''
                this.checker.clear()
            },
            PuzzleCheck() {
                if (this.checker.check()) {
                    this.shake || setTimeout(noop => {
                        this.shake = false
                    }, 300)
                    this.shake = true
                    this.showPuzzle = false
                    return false
                }
                this.lockForm = true
                this.showPuzzle = true
            },
            doAction() {
                this.PuzzleCheck()
            },
            doLogin() {
                if (this.checker.check()) {
                    this.shake || setTimeout(noop => {
                        this.shake = false
                    }, 300)
                    this.shake = true
                    return false
                }
                let { username, password, token, KeepStat, Helper } = this
                this.request('Account/Login', { username, password, token, KeepStat }).resolve(success => {
                    if (success === true) {
                        this.WaitToken = true
                        this.lockForm = true
                        this.showPuzzle = false
                    } else {
                        Helper.Storage.token = success
                        Helper.heartbeat()
                        this.cancelLogin()
                    }
                }).reject(error => this.cancelLogin() || error)
            },
            cancelLogin() {
                this.showPuzzle = false
                this.lockForm = false
                this.clearState()
                this.Helper.ActiveLogin = false
            }
        }
    }
    let i18n = {
        'Switch Language': {
            cn: 'En',
            en: '中'
        },
        'Sign in': {
            cn: '登录系统'
        },
        'Login account': {
            cn: '登录账号'
        },
        'Login password': {
            cn: '登录密码'
        },
        'Confirm login': {
            cn: '确认登录'
        },
        'Register a new account': {
            cn: '注册新账号'
        },
        'Reset password': {
            cn: '重置密码'
        },
        'keep-logged-in': {
            en: 'Keep logged in for %n days',
            cn: '保持登录%n天'
        },
        'tip-token': {
            en: 'Two-step login verification is enabled, please enter the verification code in the email',
            cn: '系统开启了登录二次验证，请输入邮件中的验证码'
        },
        'tip-account-emtpy': {
            en: 'Login account cannot be empty',
            cn: '登录账号不能为空'
        },
        'tip-password-emtpy': {
            en: 'Login password cannot be empty',
            cn: '登录密码不能为空'
        },
        'tip-token-emtpy': {
            en: 'Login verification code cannot be empty',
            cn: '登录验证码不能为空'
        },
    }
</script>
