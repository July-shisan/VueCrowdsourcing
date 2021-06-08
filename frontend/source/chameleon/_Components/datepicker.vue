<template>
    <span class="d-inline-block">
        <i class="fa fa-calendar" />
        <slot>{{startDate|datetime(dateFormat)}}<template v-if="!setting.single">{{setting.separator}}{{endDate|datetime(dateFormat)}}</template><template v-else /></slot>
        <i class="fa" :class="'fa-caret-'+setting.drops" />
    </span>
</template>
<script>
    let PickerConfig = {
        popUp: false, // default false [down]
        align: 'left', // default left     [left|center|right]

        minDate: undefined, // "2019-07-05 12:34:56"
        maxDate: undefined, // "2019-07-05 12:34:56"
        dateFormat: undefined, // [undefined|true|false|String]
        // undefined => 根据singleMode 自动判断
        // true => 长格式
        // false => 短格式
        // string => 指定格式  (查看 moment 配置手册 http://momentjs.cn/docs/#/displaying/format/)

        showTimer: undefined, // [true|false|undefined]  undefined <= use singleMode value
        timerStep: undefined, // default 1 min     [1 ~ 60] 时间选择的间隔

        singleMode: false, // default false
        // 以下仅在 singleMode 为 false 的前提下生效
        separator: ' ~ ', // 日期间隔符
        maxRangeDays: undefined, // default days      日期范围最多选择几天 必须大于0，可用浮点数
        showRangeLabel: undefined, // [undefined|true|false] 是否显示快捷范围按钮 未定义则 singleMode==true 的时候不显示
        pastRangeItems: true, // [true|false] 显示过去为主的快捷按钮
        customRangeLabel: true, // [true|false] 是否显示自定义按钮
    }
    import 'daterangepicker'
    export default {
        name: 'Datepicker',
        props: {
            value: {
                type: Object,
                required: true,
                validator: val => 'startDate' in val && 'endDate' in val
            },
            config: {
                type: Object,
                default: PickerConfig
            }
        },
        data() {
            return {
                startDate: undefined,
                endDate: undefined
            }
        },
        computed: {
            dateFormat() {
                let { dateFormat, singleMode, showTimer } = this.config || {},
                    single = !!singleMode,
                    timePicker = showTimer === undefined ? single : !!showTimer
                return dateFormat === undefined ? single && timePicker : dateFormat
            },
            setting() {
                let { popUp, align, minDate, maxDate, dateFormat, showTimer, timerStep, singleMode, separator = ' ~ ', maxRangeDays, showRangeLabel, pastRangeItems = true, customRangeLabel = true } = this.config || {},
                    single = !!singleMode,
                    drops = popUp === true ? 'up' : 'down',
                    opens = { 'left': 'right', 'center': 'center', 'right': 'left' } [align] || 'right',
                    timePicker = showTimer === undefined ? single : !!showTimer,
                    timePickerIncrement = Math.abs(timerStep) == timerStep && timerStep >= 1 && timerStep <= 60 && timerStep || undefined,
                    maxSpan = Math.abs(maxRangeDays) == maxRangeDays && maxRangeDays > 0 ? { ms: maxRangeDays * 864e5 - 1 } : undefined,
                    showCustomRangeLabel = customRangeLabel === undefined && !single || customRangeLabel === true

                return { drops, opens, maxDate, minDate, dateFormat, timePicker, timePickerIncrement, single, separator, maxSpan, showRangeLabel, showCustomRangeLabel, pastRangeItems }
            },
            rangeBefore() {
                let result = {};
                [
                    ['今日', moment().startOf('day'), moment().endOf('day')],
                    ['昨日', moment().subtract(1, 'day').startOf('day'), moment().subtract(1, 'day').endOf('day')],
                    ['过去 7 天', moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                    ['过去 30 天', moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                    ['本月', moment().startOf('month'), moment().endOf('month')],
                    ['上月', moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                ].map(([key, start, end]) => {
                    result[key] = [start, this.setting.single ? start : end]
                })
                return result
            },
            rangeAfter() {
                let result = {};
                [
                    ['今日', moment().startOf('day'), moment().endOf('day')],
                    ['一周', moment().startOf('day'), moment().add(6, 'days').endOf('day')],
                    ['本月', moment().startOf('month'), moment().endOf('month')],
                    ['30 天', moment().startOf('day'), moment().add(29, 'days').endOf('day')],
                    ['90 天', moment().startOf('day'), moment().add(89, 'days').endOf('day')],
                ].map(([key, start, end]) => {
                    result[key] = [this.setting.single ? end : start, end]
                })
                return result
            }
        },
        watch: {
            config() {
                this.instance.remove()
                this.initPicker()
            },
            'value.startDate'() {
                this.instance.remove()
                this.initPicker()
            },
            'value.endDate'() {
                this.instance.remove()
                this.initPicker()
            }
        },
        mounted() {
            this.initPicker()
        },
        destroyed() {
            this.instance.remove && this.instance.remove()
        },
        methods: {
            initPicker() {
                let { startDate, endDate } = this.value, { separator, single, showRangeLabel, pastRangeItems, ...options } = this.setting,
                    format = this.dateFormat === true ? moment.dateFormat + ' ' + moment.timeFormat : this.dateFormat === false ? moment.dateFormat : this.dateFormat,
                    ranges = (showRangeLabel === undefined && single || showRangeLabel === false) ? undefined : !pastRangeItems ? this.rangeAfter : this.rangeBefore
                if (pastRangeItems) {
                    startDate = startDate ? moment(startDate) : moment().add(-29, 'day').startOf('day')
                    endDate = endDate ? moment(endDate) : moment().endOf('day')
                } else {
                    startDate = startDate ? moment(startDate) : moment().startOf('day')
                    endDate = endDate ? moment(endDate) : moment().add(6, 'day').endOf('day')
                }
                this.updateValues(startDate, endDate)
                this.instance = $(this.$el).daterangepicker({
                    'showWeekNumbers': true,
                    'timePicker24Hour': true,
                    'alwaysShowCalendars': true,
                    'applyButtonClasses': 'btn btn-primary',
                    'cancelClass': 'btn btn-outline-secondary',
                    'singleDatePicker': single,
                    'locale': { format, separator, ...l10n },
                    startDate,
                    endDate,
                    ranges,
                    ...options
                }, (start, end) => {
                    this.updateValues(start, end)
                    this.$emit('reload')
                }).data('daterangepicker')
            },
            updateValues(start, end) {
                let format = 'YYYY-MM-DD HH:mm:ss'
                if (this.setting.single) {
                    this.startDate = moment(start)
                    this.endDate = undefined
                    this.value.startDate = moment(start).add(1, 'ms').format(format)
                    this.value.endDate = undefined
                } else {
                    this.startDate = moment(start)
                    this.endDate = moment(end)
                    this.value.startDate = moment(start).format(format)
                    this.value.endDate = moment(end).add(1, 'ms').format(format)
                }
            }
        },
    }
    let l10n = {
        'applyLabel': '确定',
        'cancelLabel': '取消',
        'customRangeLabel': '自定义',
        'weekLabel': '周',
        'daysOfWeek': ['日', '一', '二', '三', '四', '五', '六'],
        'monthNames': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    }
</script>
