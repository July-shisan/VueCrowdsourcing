<template>
    <Review :uuid="uuid" :dismiss="dismiss" :Done="doAction">
        <div class="row">
            <label class="col-6">
                <input v-model="Params.status" type="radio" class="d-none" value="reject" @change="validator.check('status')">
                <span class="btn d-block" :class="Params.status=='reject'?'btn-danger':'btn-outline-danger'">
                    <i class="bi bi-x-lg" /> {{"Reject"|i18n(i18n)}}
                </span>
            </label>
            <label class="col-6">
                <input v-model="Params.status" type="radio" class="d-none" value="permit" @change="validator.check('status')">
                <span class="btn d-block" :class="Params.status=='permit'?'btn-success':'btn-outline-success'">
                    <i class="bi bi-check-lg" /> {{"Permit"|i18n(i18n)}}
                </span>
            </label>
            <span class="form-control d-none" :class="{'is-invalid':tips.status}" />
            <span class="invalid-feedback text-center">{{tips.status}}</span>
        </div>
        <div v-if="Params.status=='reject'" class="mt-3">
            <textarea v-model.trim="Params.reason" class="form-control" :class="{'is-invalid':tips.reason}" :placeholder="'reason'|i18n(i18n)" @blur="validator.check('reason')" />
            <span class="invalid-feedback">{{tips.reason}}</span>
        </div><template v-else />
    </Review>
</template>
<script>
    export default {
        components: {
            Review: () => import('./event-review'),
        },
        props: {
            uuid: {
                type: String,
                required: true
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
                Event: {},
                Detail: [],
                Params: {}
            }
        },
        computed: {
            i18n: () => i18n,
            tips() {
                return this.validator.tips
            },
        },
        created() {
            this.Params = { status: 0, reason: '' }
            this.validator.register(this, this.Params, () => ({
                status: [v => !['permit', 'reject'].includes(v), 'Please audit the event', i18n],
                reason: [
                    ['noempty', this.Params.status == 'reject'],
                    ['length', [undefined, 128], this.Params.status == 'reject'],
                ]
            }))
        },
        methods: {
            doAction(VerifyPassword) {
                if (this.validator.check()) {
                    return
                }
                this.request('System/UpdateAudit', { uuid: this.uuid, ...this.Params, VerifyPassword }).finally(this.Done)
            },
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
        'subject': {
            cn: '触发动作'
        },
        'operation': {
            cn: '动作详情'
        },
        'Permit': {
            cn: '通过'
        },
        'Reject': {
            cn: '驳回'
        },
        'Please audit the event': {
            cn: '请审核事件'
        },
        'reason': {
            cn: '驳回原因'
        },
    }
</script>
