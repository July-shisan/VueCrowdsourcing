<template>
    <div class="table-responsive">
        <table class="table table-bordered table-hover">
            <SortHeader :Columns="Columns" :Contents="Contents" :CheckedRows="CheckedRows" :i18n="i18n">
                <template #prepend>
                    <slot name="prepend" />
                </template>
                <template #append>
                    <slot name="append" />
                </template>
                <template v-for="(x, index) in Columns" :slot="'header-'+index">
                    <slot :name="'header-'+index" />
                </template>
            </SortHeader>
            <tbody v-if="Contents.length">
                <slot />
            </tbody>
            <tbody v-else>
                <tr class="no-result">
                    <td colspan="30">{{"No data"|i18n}}</td>
                </tr>
            </tbody>
            <tfoot>
                <slot name="tfoot" />
            </tfoot>
        </table>
    </div>
</template>
<script>
    export default {
        name: 'SortableTable',
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
        }
    }
</script>
