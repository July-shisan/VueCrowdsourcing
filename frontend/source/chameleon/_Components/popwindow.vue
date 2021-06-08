<template>
    <div class="pop-mask">
        <form v-moveable v-escape="dismiss" class="card" autocomplete="off" @submit.prevent="Confirm">
            <div class="card-header handler">
                <slot name="title">Window Title</slot>
                <button type="button" class="btn-close float-end" @click="Cancel" />
            </div>
            <div class="card-body">
                <slot />
            </div>
            <div class="card-footer input-group">
                <span class="btn btn-secondary rounded" @click="Cancel">{{Done?"Cancel":"Close"|i18n("button")}}</span>
                <input v-if="VerifyPassword" v-model="password" type="password" size="30" class="form-control rounded-start ms-2" :class="{'is-invalid':checker.tips.password}" :placeholder="'CheckPasswordTip'|i18n" @blur="checker.check('password')"><template v-else />
                <button v-if="VerifyPassword||Done" class="btn" :class="[{disabled:hasError,'rounded ms-2':!VerifyPassword}, btnClass]">
                    <slot name="button">{{"Confirm"|i18n("button")}}</slot>
                </button><template v-else />
            </div>
        </form>
    </div>
</template>
<script>
    export default {
        name: 'PopWindow',
        props: {
            VerifyPassword: {
                type: Boolean,
                default: false
            },
            btnConfig: {
                type: Object,
                default: () => ({})
            },
            dismiss: {
                type: Function,
                default: () => alert('please privode a cancel callback')
            },
            Done: {
                type: [Function, Boolean],
                required: true
            }
        },
        data() {
            return {
                password: undefined,
                checker: undefined,
            }
        },
        computed: {
            hasError() {
                return this.VerifyPassword && this.checker.errors || this.btnChecker.errors || this.validator.errors
            },
            btnChecker() {
                let checker = this.btnConfig.checker || {}
                if (isProto(checker.clone, 'Function')) {
                    return checker
                }
                let { errors = 0, check = noop => 0, clear = noop => {} } = checker
                return { errors, check, clear }
            },
            btnClass() {
                return this.btnConfig.class || 'btn-primary'
            },
        },
        created() {
            this.checker = this.validator.clone().register(this, this.$data, () => ({
                password: ['noempty']
            }))
        },
        methods: {
            Confirm() {
                let errors = this.validator.check()
                errors += this.btnChecker.check()
                errors += this.VerifyPassword ? this.checker.check() : 0
                if (errors) {
                    return
                }
                this.Done ? this.Done(this.password) : alert('please privode a success callback')
                this.password = undefined
            },
            Cancel() {
                this.checker.clear()
                this.btnChecker.clear()
                this.dismiss()
            }
        }
    }
</script>
