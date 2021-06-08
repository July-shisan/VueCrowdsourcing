<template>
    <div v-if="total && search.limit!==false" class="Pagination rounded-bottom border border-top-0">
        <span>{{'Every Page'|i18n(i18n)}}</span>
        <select v-model.number="page_limit" class="form-select form-select-sm mx-2" @change="setLimit">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
        </select>
        <span>{{'Records'|i18n(i18n)}} / {{'total_pages'|i18n(i18n, ['%n', maxPage])}}</span>
        <span class="mx-auto">{{'current_records'|i18n(i18n, ['%n', range])}} / {{'total_records'|i18n(i18n, ['%n', total])}}</span>
        <span class="btn btn-sm" :class="{disabled:page_start==1}" @click="pageTo(1)"><i class="bi bi-chevron-double-left" /></span>
        <span class="btn btn-sm" :class="{disabled:page_start==1}" @click="pageGo(-1)"><i class="bi bi-chevron-left" /></span>
        <input v-model.number.lazy="page_start" class="form-control form-control-sm" type="number" min="1" :max="maxPage" @change="pageTo(page_start)" @input="parsePage(page_start)">
        <span class="btn btn-sm" :class="{disabled:page_start==maxPage}" @click="pageGo(+1)"><i class="bi bi-chevron-right" /></span>
        <span class="btn btn-sm" :class="{disabled:page_start==maxPage}" @click="pageTo(maxPage)"><i class="bi bi-chevron-double-right" /></span>
    </div>
</template>
<script>
    export default {
        name: 'Pagination',
        props: {
            search: {
                type: Object,
                required: true,
                validator: val => 'page' in val && 'limit' in val
            },
            total: {
                type: Number,
                required: true,
                validator: val => !isNaN(val) && val >= 0
            }
        },
        data() {
            return {
                page_start: 1,
                page_limit: 10,
                reloadTimer: null
            }
        },
        computed: {
            i18n: () => i18n,
            range() {
                let { page_start, page_limit, total } = this
                let start = page_limit * (page_start - 1),
                    end = Math.min(start + page_limit, this.total)
                return (total ? start + 1 : 0) + '-' + end
            },
            maxPage() {
                return Math.ceil(this.total / this.page_limit)
            }
        },
        watch: {
            total() {
                let page_num = Math.max(1, Math.min(this.page_start, this.maxPage))
                this.search.page = page_num
                this.page_start = page_num
            }
        },
        created() {
            let { page, limit } = this.search
            this.page_start = page
            this.page_limit = limit
        },
        destroyed() {
            this.reloadTimer && clearTimeout(this.reloadTimer)
        },
        methods: {
            parsePage(num) {
                this.page_start = Math.max(1, Math.min(this.maxPage, Math.round(num) || 1))
            },
            pageGo(side = 0) {
                this.pageTo(Math.max(1, Math.min(this.maxPage, this.page_start + side)))
            },
            pageTo(num) {
                this.parsePage(num)
                if (this.page_start != this.search.page) {
                    this.search.page = this.page_start
                    this.reload()
                }
            },
            setLimit() {
                let { page_start, page_limit } = this
                this.search.limit = page_limit
                this.search.page = Math.max(1, Math.min(this.maxPage, page_start))
                this.page_start = this.search.page
                this.reload()
            },
            reload() {
                this.reloadTimer && clearTimeout(this.reloadTimer)
                this.reloadTimer = setTimeout(noop => {
                    this.$emit('reload')
                }, 400)
            }
        }
    }
    let i18n = {
        'Every Page': {
            cn: '每页'
        },
        'Records': {
            cn: '条'
        },
        'total_pages': {
            en: 'Total %n Page(s)',
            cn: '共 %n 页'
        },
        'current_records': {
            en: 'Current %n Record(s)',
            cn: '当前 %n 条'
        },
        'total_records': {
            en: 'Total %n Record(s)',
            cn: '共 %n 条'
        },
    }
</script>
<style lang="scss">
    .Pagination {
        display: flex;
        background: rgba(255, 255, 255, .7) linear-gradient(to bottom, #fafafaaf 0, #edededaf 100%);
        padding: .5em 1em;
        align-items: center;
        .btn.disabled {
            cursor: not-allowed;
            opacity: .3;
        }
        select {
            width: auto;
        }
        input {
            padding-left: 1.5em;
            width: auto;
        }
        .btn+.btn {
            margin-left: 0;
        }
    }
</style>
