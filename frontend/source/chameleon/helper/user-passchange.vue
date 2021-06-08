<template>
    <div v-escape="dismiss" class="pop-mask product" :class="'product-'+Helper.Product.pin">
        <form id="LoginPassword" class="card max-w50" autocomplete="off" @submit.prevent="action">
            <div class="card-header text-center">{{'Change Password'|i18n(i18n)}}<button type="button" class="btn-close btn-close-white float-end" @click="dismiss" /></div>
            <div class="card-body">
                <label v-if="WaitToken" class="form-label-group">
                    <input v-model="token" type="text" autocomplete="new-password" class="form-control" :class="{'is-invalid':validator.tips.token}" :placeholder="'tip-token'|i18n(i18n)" @blur="validator.check('token')">
                    <span class="invalid-feedback">{{validator.tips.token}}</span>
                </label>
                <fieldset v-else>
                    <label class="form-label-group">
                        <i class="bi bi-key bg-primary" />
                        <input v-model="current" type="password" autocomplete="new-password" class="form-control" :class="{'is-invalid':validator.tips.current}" :placeholder="'Current Password'|i18n(i18n)" @blur="validator.check('current')">
                        <span class="invalid-feedback">{{validator.tips.current}}</span>
                    </label>
                    <label class="form-label-group">
                        <i class="bi bi-key-fill bg-primary" />
                        <input v-model="newpass" type="password" autocomplete="new-password" class="form-control" :class="{'is-invalid':validator.tips.newpass}" :placeholder="'New Password'|i18n(i18n)" @blur="validator.check('newpass')">
                        <span class="invalid-feedback">{{validator.tips.newpass}}</span>
                    </label>
                    <label class="form-label-group">
                        <i class="bi bi-key-fill bg-primary" />
                        <input v-model="confirm" type="password" autocomplete="new-password" class="form-control" :class="{'is-invalid':validator.tips.confirm}" :placeholder="'Confirm Password'|i18n(i18n)" @blur="validator.check('confirm')">
                        <span class="invalid-feedback">{{validator.tips.confirm}}</span>
                    </label>
                </fieldset>
                <div class="text-end">
                    <button v-if="!Profile.ForcePassChange" type="button" class="btn btn-secondary" @click="dismiss">{{'Cancel'|i18n('button')}}</button>
                    <button v-else type="button" class="btn btn-secondary" @click="Helper.heartbeat('Sign Out')">{{'Sign Out'|i18n(i18n)}}</button>
                    <button type="submit" class="btn btn-primary" :class="{disabled:validator.errors}">{{'Change Password'|i18n(i18n)}}</button>
                </div>
            </div>
            <div class="card-footer text-center">
                <div>Copyright &copy; {{Product.copyright|ccyear}}</div>
                <div>{{Product.psfn}}</div>
            </div>
        </form>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                current: '',
                newpass: '',
                confirm: '',
                token: '',
                WaitToken: false
            }
        },
        computed: {
            i18n: () => i18n,
            Product() {
                return this.Helper.Product
            },
            Profile() {
                return this.Helper.Profile
            }
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
            } = this.Helper.Rules
            const Rules = {
                current: ['noempty', i18n, 'tip-current'],
                newpass: [
                    ['noempty', i18n, 'tip-newpass'],
                    [v => v == this.current, i18n, 'tip-samepass'],
                    [v => v.includes(this.Profile.username), i18n, 'tip-include-account'],
                ],
                confirm: [
                    ['noempty', i18n, 'tip-confirm'],
                    [v => v != this.newpass, i18n, 'tip-confirm-diff']
                ],
                token: ['noempty', this.WaitToken]
            }
            // 最短长度
            pass_min_length && Rules.newpass.push(['length', [pass_min_length]])
            // 过滤弱密码
            pass_weak_define && pass_filter_weak && Rules.newpass.push(['pass_filter_weak', [pass_weak_define]])
            // 过滤联系键位字符
            pass_max_sequence && Rules.newpass.push(['pass_max_sequence', [pass_max_sequence, pass_key_sequence]])
            // 过滤重复字符
            pass_max_repeat && Rules.newpass.push(['pass_max_repeat', [pass_max_repeat]])
            // 强制字符类型
            pass_min_types && Rules.newpass.push(['pass_min_types', [pass_min_types]])
            this.validator.register(this, this.$data, () => Rules)
        },
        methods: {
            dismiss() {
                this.Profile.ChangingPass = false
            },
            action() {
                if (this.validator.check()) {
                    return false
                }
                const { current, newpass, token } = this
                this.request('Account/ChangePassword', { current, newpass, token }).resolve(success => {
                    if (success === true) {
                        this.WaitToken = true
                        return
                    }
                    this.dismiss()
                }).reject(error => {
                    Object.assign(this, { current: '', newpass: '', confirm: '', token: '' })
                    return error
                })
            }
        }
    }
    let i18n = {
        'Change Password': {
            cn: '修改密码'
        },
        'Current Password': {
            cn: '当前密码'
        },
        'New Password': {
            cn: '新密码'
        },
        'Confirm Password': {
            cn: '确认密码'
        },
        'Sign Out': {
            cn: '退出登录'
        },
        'tip-current': {
            en: 'Please enter your current password',
            cn: '请输入您当前的密码'
        },
        'tip-newpass': {
            en: 'Please set a new password',
            cn: '请设置新密码'
        },
        'tip-samepass': {
            en: 'The old and new passwords must be different',
            cn: '新旧密码必须不同'
        },
        'tip-include-account': {
            en: 'Prohibit including account name',
            cn: '禁止包含帐户名称'
        },
        'tip-confirm': {
            en: 'Please re-enter the new password',
            cn: '请重新输入新密码'
        },
        'tip-confirm-diff': {
            en: 'Please confirm the new password is correct',
            cn: '请确认新密码正确'
        },
        'tip-token': {
            en: 'Enter the verification code received in your email.',
            cn: '输入您电子邮件中收到的验证码。'
        },
    }
</script>
