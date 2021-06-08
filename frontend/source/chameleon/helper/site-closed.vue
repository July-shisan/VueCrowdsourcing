<template>
    <div class="pop-mask product" :class="'product-'+Product.pin">
        <div v-moveable class="card bg-secondary text-light max-w40">
            <div class="card-header handler">{{Product.title}}</div>
            <div class="card-body text-center">
                <div class="display-4">{{'not-open'|i18n(i18n)}}</div>
                <div class="display-5 p-3">{{'open-time'|i18n(i18n)}}: {{Security.SiteClosed}}</div>
                <div class="text-center py-3">Copyright &copy; {{Product.copyright|ccyear}}</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        computed: {
            i18n: () => i18n,
            Product() {
                return this.Helper.Product
            },
            Security() {
                return this.Helper.Security
            },
        }
    }
    let i18n = {
        'not-open': {
            en: 'Close Access',
            cn: '关闭访问'
        },
        'open-time': {
            en: 'Opening hours',
            cn: '开放时间'
        },
    }
</script>
