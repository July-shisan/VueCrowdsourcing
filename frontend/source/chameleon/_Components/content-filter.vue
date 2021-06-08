<template>
    <form class="input-group search" @submit.prevent="Reload">
        <span class="btn btn-secondary dropdown-toggle">{{Search.sk|i18n(i18n)}}</span>
        <div class="dropdown-menu">
            <a v-for="label in Labels" :key="label" class="dropdown-item" :class="{active:label==Search.sk}" @click="Search.sk=label">{{label|i18n(i18n)}}</a>
        </div>
        <input v-model="Search.sv" type="text" size="30" class="form-control" :placeholder="'Please enter search criteria'|i18n">
        <span v-if="Search.sv" class="clear-search" @click="Search.sv='';Reload()" /><template v-else />
        <button class="btn btn-primary"><i class="bi bi-search" /></button>
    </form>
</template>
<script>
    export default {
        name: 'ContentFilter',
        props: {
            Reload: {
                type: Function,
                required: true
            },
            Search: {
                type: Object,
                required: true
            },
            Labels: {
                type: Array,
                required: true
            },
            i18n: {
                type: Object,
                default: () => ({})
            }
        },
    }
</script>
