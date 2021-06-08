<template>
    <svg class="mb-1" width="1rem" height="1rem" fill="none" style="transform: rotate(-90deg);" :viewBox="viewBox">
        <circle r="25" cx="50" cy="50" :stroke="stroke" stroke-width="50" :stroke-dasharray="dash" />
    </svg>
</template>
<script>
    export default {
        props: {
            value: {
                type: Number,
                default: 0,
                required: true
            },
            type: {
                type: String,
                default: 'square'
            },
            stroke: {
                type: String,
                default: 'yellowgreen'
            }
        },
        computed: {
            dash() {
                return Math.round(this.value * 1.58) + ' 158'
            },
            viewBox() {
                return this.type == 'circle' ? '0 0 100 100' : '15 15 70 70'
            }
        }
    }
</script>
