<template>
    <div class="chart-wrapper">
        <div v-resize="resizeChart" />
    </div>
</template>
<script>
    import * as Echart from 'echarts'
    export default {
        name: 'Echart',
        props: {
            value: {
                type: Object,
                required: true
            },
            events: {
                type: Object,
                default: () => ({})
            }
        },
        watch: {
            'value': 'updateChart',
            'Helper.FlatLayout': 'resizeChart',
            'Helper.FullScreen': 'resizeChart'
        },
        mounted() {
            this.Chart = Echart.init(this.$el.querySelector('div'))
            for (let event in this.events) {
                this.Chart.on(event, this.events[event])
            }
            this.updateChart()
        },
        destroyed() {
            this.Chart.dispose()
            this.updateTimer && clearTimeout(this.updateTimer)
            this.resizeTimer && clearTimeout(this.resizeTimer)
        },
        methods: {
            updateChart() {
                this.updateTimer = this.updateTimer || setTimeout(noop => {
                    this.update()
                    this.updateTimer = undefined
                }, 50)
            },
            resizeChart() {
                this.resizeTimer = this.resizeTimer || setTimeout(noop => {
                    this.update()
                    this.resizeTimer = undefined
                }, 50)
            },
            update() {
                this.Chart.clear()
                this.Chart.resize()
                this.Chart.setOption(this.value, {
                    notMerge: true,
                    lazyUpdate: true,
                    silent: true
                })
            }
        }
    }
</script>
<style lang="scss">
    .chart-wrapper {
        position: relative;
        >div {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
</style>
