<template>
    <thead>
        <tr>
            <th v-if="CheckedRows" class="text-center w-1">
                <span role="button" @click="SwitchState"><i class="bi" :class="CheckClass" /></span>
            </th><template v-else />
            <slot name="prepend" />
            <th v-for="({class:iClass, field, i18n:i18}, index) in Columns" :key="field" :class="iClass">
                <template v-if="!Sorters[field]">{{field|i18n(i18||i18n)}}</template>
                <span v-else :data-sort="Sorters[field][0]" @click="SortColumn(field)">{{field|i18n(i18||i18n)}}</span>
                <slot :name="'header-'+index" />
            </th>
            <slot name="append" />
        </tr>
    </thead>
</template>
<script>
    export default {
        name: 'SortHeader',
        props: {
            Columns: {
                type: Array,
                required: true
            },
            Contents: {
                type: Array,
                required: true
            },
            CheckedRows: {
                type: [Array, Boolean],
                default: false
            },
            i18n: {
                type: [Object, String],
                default: ''
            }
        },
        data() {
            return {
                Sorters: {},
                ActiveSorter: {}
            }
        },
        computed: {
            CheckableItems() {
                return this.Contents.filter(item => !item._locked)
            },
            CheckClass() {
                let len_count = this.CheckableItems.length,
                    len_check = this.CheckedRows.length
                return (!len_count || !len_check) ? 'bi-square text-secondary' :
                    (len_check < len_count) ? 'bi-check-square text-muted' :
                    'bi-check-square-fill text-primary'
            }
        },
        watch: {
            Contents: {
                handler(val) {
                    this.Sorters = this.Columns.reduce((rtn, { sort, field }) => {
                        let rule = this.ActiveSorter[field] || '',
                            [first, second] = [...new Set(val.map(row => String(row[field])))]
                        return sort && second != undefined ? { ...rtn, [field]: [sort + rule, first, second] } : rtn
                    }, {})
                    this.ActiveSorter = {}
                },
                immediate: true
            }
        },
        methods: {
            SortColumn(field) {
                let Rules = ['string', 'number', 'amount'],
                    [sort, noop, b] = this.Sorters[field] || [],
                    [rule, order] = sort.split('|')
                if (!Rules.includes(rule) && DevMode) {
                    alert('Please check sort type,\nAvailable type is [' + Rules.join('|') + ']')
                } else if (b != undefined && Rules.includes(rule)) {
                    this.Contents.sort((a, b) => String(a[field]).localeCompare(String(b[field]), undefined, { numeric: true }) * (order == 'desc' ? 1 : -1))
                    this.ActiveSorter[field] = order == 'desc' ? '|asc' : '|desc'
                }
            },
            SwitchState() {
                let state = !this.CheckedRows.length
                this.CheckableItems.map(item => Object.assign(item, { _checked: state }))
            }
        }
    }
</script>
