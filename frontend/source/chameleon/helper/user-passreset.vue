<template>
    <form id="LoginPassword" v-escape="clearState" class="card max-w50" autocomplete="off" @submit.prevent="doReset">
        <div class="card-header text-center">{{'Reset password'|i18n(i18n)}} - {{Product.title}}<button type="button" class="btn-close float-end" @click="clearState" /></div>
        <div class="card-body">
            <label class="form-label-group">
                <i class="bi bi-envelope bg-primary" />
                <input v-model="email" type="text" :disabled="lockForm" class="form-control" :class="{'is-invalid':tips.email,'is-valid':WaitToken}" :readonly="WaitToken" :placeholder="'tip-email'|i18n(i18n)" @blur="validator.check('email')">
                <span class="invalid-feedback">{{tips.email|i18n(i18n)}}</span>
            </label>
            <label class="form-label-group">
                <i class="bi bi-key bg-primary" />
                <input v-model="password" type="text" :disabled="lockForm" class="form-control" :class="{'is-invalid':tips.password,'is-valid':WaitToken}" :readonly="WaitToken" :placeholder="'tip-password'|i18n(i18n)" @blur="validator.check('password')">
                <span class="invalid-feedback">{{tips.password|i18n(i18n)}}</span>
            </label>
            <label class="form-label-group text-nowrap">
                <i class="bi bi-puzzle-fill bg-primary" />
                <input v-model="token" type="text" :disabled="!WaitToken" class="form-control" :class="{'is-invalid':tips.token}" :placeholder="'tip-token'|i18n(i18n)" @blur="validator.check('token')">
                <button type="button" :disabled="lockForm" class="btn btn-primary ms-3 px-4 d-inline-flex align-items-center" @click="doAction">{{'Send verification email'|i18n(i18n)}}</button>
                <span class="invalid-feedback">{{tips.token|i18n(i18n)}}</span>
            </label>
            <div class="row">
                <div class="col-6">
                    <button type="button" class="btn btn-secondary form-control" @click="clearState">{{'Back to login'|i18n(i18n)}}</button>
                </div>
                <div class="col-6">
                    <button type="submit" :disabled="!token" class="btn btn-success form-control ml-0" :class="{disabled:validator.errors,shake}">{{'Reset password'|i18n(i18n)}}</button>
                </div>
            </div>
        </div>
        <div class="card-footer text-center">Copyright &copy; {{Product.copyright|ccyear}}</div>
        <Puzzle v-if="showPuzzle" :Done="doReset" :dismiss="CancelPuzzle" /><template v-else />
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
                email: '',
                password: '',
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
            this.validator.register(this, this.$data, () => ({
                email: [
                    ['noempty', i18n, 'tip-email-empty'],
                    ['email', i18n, 'tip-email-invalid']
                ],
                password: [
                    ['noempty', i18n, 'tip-password-empty'],
                    ['length', [8], i18n, 'tip-password-length'],
                ],
                token: ['noempty', i18n, 'tip-token-empty', this.WaitToken]
            }))
        },
        methods: {
            PuzzleCheck() {
                if (this.validator.check()) {
                    return false
                }
                this.lockForm = true
                this.showPuzzle = true
            },
            doAction() {
                this.PuzzleCheck()
            },
            CancelPuzzle() {
                this.lockForm = false
                this.showPuzzle = false
            },
            doReset() {
                this.showPuzzle = false
                const { email, password, token } = this
                this.request('Account/ResetPassword', { email, password, token }).resolve(success => {
                    if (success === true) {
                        this.WaitToken = true
                        this.lockForm = true
                    } else {
                        this.clearState()
                    }
                }).reject(error => {
                    this.clearState()
                })
            },
        }
    }
    let i18n = {
        'Reset password': {
            cn: '重置密码'
        },
        'Back to login': {
            cn: '返回登录'
        },
        'Send verification email': {
            cn: '发送验证邮件'
        },
        'tip-email': {
            en: 'Please fill in the email address when registering',
            cn: '请填写注册时的邮箱地址'
        },
        'tip-email-empty': {
            en: 'Email address cannot be empty',
            cn: '邮件地址不能为空'
        },
        'tip-email-invalid': {
            en: 'Please confirm the email address format is correct',
            cn: '请确认邮箱地址格式正确'
        },
        'tip-password': {
            en: 'Reset login password',
            cn: '重新设置登录密码'
        },
        'tip-password-empty': {
            en: 'Password cannot be empty',
            cn: '密码不能为空'
        },
        'tip-password-length': {
            en: 'The minimum password is 8 digits',
            cn: '密码最短8位'
        },
        'tip-token': {
            en: 'Please fill in the reset verification code',
            cn: '请填写重置验证码'
        },
        'tip-token-empty': {
            en: 'Confirmation code cannot be empty',
            cn: '确认码不能为空'
        },
    }
</script>
