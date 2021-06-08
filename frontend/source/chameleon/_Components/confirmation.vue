<template>
    <div class="pop-mask">
        <form v-moveable v-escape="dismiss" class="card max-w50" autocomplete="off" @submit.prevent="Confirm">
            <div class="card-header handler">
                <slot name="title">{{'title'|i18n(i18n)}}</slot>
                <button type="button" class="btn-close float-end" @click="dismiss" />
            </div>
            <div class="card-body d-flex">
                <div class="text-warning display-2 m-4">
                    <i class="bi bi-exclamation-triangle" />
                </div>
                <div class="p-4">
                    <div class="h1">
                        <slot>{{'body'|i18n(i18n)}}</slot>
                    </div>
                    <div class="text-danger">
                        <slot name="alert">{{'alert'|i18n(i18n)}}</slot>
                    </div>
                </div>
            </div>
            <div class="card-footer input-group">
                <span class="btn btn-secondary rounded" @click="dismiss">{{"Cancel"|i18n("button")}}</span>
                <input v-if="VerifyPassword" v-model="password" type="password" size="30" class="form-control rounded-start ms-2" :class="{'is-invalid':checker.tips.password}" :placeholder="'CheckPasswordTip'|i18n" @blur="checker.check('password')"><template v-else />
                <button v-if="VerifyPassword||Done" class="btn btn-danger" :class="{'disabled':hasError,'rounded ms-2':!VerifyPassword}">
                    <slot name="button">{{"Confirm"|i18n("button")}}</slot>
                </button><template v-else />
            </div>
        </form>
    </div>
</template>
<script>
    export default {
        name: 'Confirmation',
        props: {
            VerifyPassword: {
                type: Boolean,
                default: false
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
                password: '',
                checker: false
            }
        },
        computed: {
            i18n: () => i18n,
            hasError() {
                return this.VerifyPassword && this.checker.errors
            },
        },
        created() {
            this.checker = this.validator.clone().register(this, this.$data, () => ({
                password: ['noempty']
            }))
        },
        methods: {
            Confirm() {
                if (this.VerifyPassword && this.checker.check()) {
                    return
                }
                this.Done ? this.Done(this.password) : alert('please privode a success callback')
                this.password = ''
            }
        }
    }
    let i18n = {
        'title': {
            en: 'Delete Confirm',
            cn: '删除确认'
        },
        'alert': {
            en: 'The delete operation cannot be recovered.',
            cn: '删除操作无法恢复。'
        },
        'body': {
            en: 'Please confirm the operation.',
            cn: '请确认操作。'
        }
    }
</script>
