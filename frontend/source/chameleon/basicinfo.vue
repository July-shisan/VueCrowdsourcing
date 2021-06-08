<template>
    <div>
        <Navigation />
        <div class="card card-body">
            <div class="mb-3">
                <label class="form-label">产品名称</label>
                <input v-model="Product.title" class="form-control" :class="{'is-invalid':tips.title}" @blur="validator.check('title')">
                <span class="invalid-feedback">{{tips.title}}</span>
            </div>
            <div class="mb-3">
                <label class="form-label">产品主页</label>
                <input v-model="Product.homepage" class="form-control" :class="{'is-invalid':tips.homepage}" @blur="validator.check('homepage')">
                <span class="invalid-feedback">{{tips.homepage}}</span>
            </div>
            <div class="mb-3">
                <label class="form-label">版权说明 <span class="small text-muted">%YEAR% 会自动替换为当前年份</span></label>
                <input v-model="Product.copyright" class="form-control" :class="{'is-invalid':tips.copyright}" @blur="validator.check('copyright')">
                <span class="invalid-feedback">{{tips.copyright}}</span>
            </div>
            <div class="mb-3">
                <label class="form-label">网站备案号</label>
                <input v-model="Product.psfn" class="form-control">
            </div>
            <div class="mb-3 text-end">
                <button type="button" class="btn btn-primary" @click="ChangeInfo">保存</button>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                Product: { ...this.Helper.Product },
            }
        },
        computed: {
            tips() {
                return this.validator.tips
            },
        },
        created() {
            this.validator.register(this, this.Product, () => ({
                'title': ['noempty'],
                'homepage': ['noempty'],
                'copyright': ['noempty'],
            }))
        },
        methods: {
            ChangeInfo() {
                const { title, homepage, copyright, psfn } = this.Product
                this.request('Service/UpdateProductInfo', { title, homepage, copyright, psfn }).finally(noop => location.reload())
            }
        }
    }
</script>
