<template>
    <div class="calendar font-monospace rounded max-w40" @click.stop>
        <div class="title h5">
            <button type="button" :disabled="prevDisabled" @click="year(-1)"><i class="fa fa-angle-double-left" /></button>
            <button type="button" :disabled="prevDisabled" @click="month(-1)"><i class="fa fa-angle-left" /></button>
            <strong @click="toggleYearMonth">{{panels.y}}/{{panels.m}} <i class="fa" :class="showYearPanel?'fa-angle-double-up':'fa-angle-double-down'" /></strong>
            <button type="button" :disabled="nextDisabled" @click="month(+1)"><i class="fa fa-angle-right" /></button>
            <button type="button" :disabled="nextDisabled" @click="year(+1)"><i class="fa fa-angle-double-right" /></button>
        </div>
        <template v-if="showYearPanel">
            <div class="body grid7">
                <div><i class="fa fa-angle-double-left text-dark" /></div>
                <div v-for="i in [-2,-1,0,1,2]" :key="'y'+i">
                    <span>{{panels.y+i}}</span>
                </div>
                <div><i class="fa fa-angle-double-right text-dark" /></div>
            </div>
            <div class="body grid4" @click="toggleYearMonth">
                <div v-for="i in [0,1,2,3,4,5,6,7,8,9,10,11]" :key="'m'+i">
                    <span>{{i|i18n(i18n)}}</span>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="grid7">
                <div>{{'日'|i18n(i18n)}}</div>
                <div>{{'一'|i18n(i18n)}}</div>
                <div>{{'二'|i18n(i18n)}}</div>
                <div>{{'三'|i18n(i18n)}}</div>
                <div>{{'四'|i18n(i18n)}}</div>
                <div>{{'五'|i18n(i18n)}}</div>
                <div>{{'六'|i18n(i18n)}}</div>
            </div>
            <div class="body grid7">
                <div v-for="(day, i) in Contents.slice(0, 42)" :key="i" @mouseover="hover(day)" @click="select(day)">
                    <label v-if="day.fake" :class="{'text-danger':day.date==today.label}">
                        <code v-if="day.closed" class="text-warning small mt-n3 position-absolute">{{'休'|i18n(i18n)}}</code>
                        <code v-else-if="day.isfull" class="text-danger small mt-n3 position-absolute">{{'满'|i18n(i18n)}}</code>
                        <template v-else />{{day.d}}
                    </label>
                    <span v-else :class="[{'today':day.date==today.label},...day.class]">{{day.d}}</span>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
    export default {
        name: 'Calendar',
        props: {
            config: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                mode: ['range', 'date'][0],
                selected: [{}, {}],
                today: {
                    moffset: 0,
                    yoffset: 0,
                },
                panels: {},
                Contents: [],

                showYearPanel: false
            }
        },
        computed: {
            i18n: () => i18n,
            prevDisabled() {
                if (!this.config.notBefore) {
                    return false
                }
                let prev = new Date(),
                    { notBefore } = this.config,
                    { moffset, year, month } = this.today
                prev.setUTCFullYear(year, month + moffset - 1, 1)
                prev.setUTCHours(0, 0, 0, 0)
                notBefore = new Date(notBefore)
                notBefore.setUTCDate(1)
                return prev < notBefore
            },
            nextDisabled() {
                if (!this.config.notAfter) {
                    return false
                }
                let next = new Date(),
                    { notAfter } = this.config,
                    { moffset, year, month } = this.today
                next.setUTCFullYear(year, month + moffset + 1, 1)
                next.setUTCHours(0, 0, 0, 0)
                notAfter = new Date(notAfter)
                notAfter.setUTCDate(1)
                return next > notAfter
            }
        },
        watch: {
            config: {
                handler: 'RefreshContents',
                deep: true
            }
        },
        created() {
            let moffset = 0,
                yoffset = 0,
                stamp = new Date(new Date().setUTCHours(0, 0, 0, 0)),
                { notBefore, activeDate } = this.config

            let year = stamp.getUTCFullYear(),
                month = stamp.getUTCMonth(),
                date = stamp.toISOString().substr(0, 10),
                label = date
            if (notBefore) {
                stamp = new Date(notBefore)
            }
            if (activeDate) {
                date = new Date(activeDate)
                date.setUTCHours(0, 0, 0, 0)
                let y = date.getUTCFullYear(),
                    m = date.getUTCMonth()
                yoffset = y - year
                moffset = m - month
                this.selected = [{ date: activeDate }, {}]
            }
            Object.assign(this.today, { yoffset, moffset, year, month, date, label })
        },
        mounted() {
            this.RefreshContents()
        },
        methods: {
            RefreshContents() {
                let { yoffset, moffset, year, month } = this.today
                this.Contents = this.fillMonth(year + yoffset, month + moffset)
                let [a, b] = this.selected
                this.selected = [{}, {}]
                a.date && this.select(a, true)
                b.date && this.select(b, true)
            },
            toggleYearMonth() {
                this.showYearPanel ^= 1

            },
            month(offset) {
                this.today.moffset += offset
                this.showYearPanel = false
                this.RefreshContents()
            },
            year(offset) {
                this.today.yoffset += offset
                this.showYearPanel = false
                this.RefreshContents()
            },
            fillMonth(year, month) {
                let contents = [],
                    stamp = new Date()
                stamp.setUTCFullYear(year, month, 1)
                stamp.setUTCHours(0, 0, 0, 0)
                let smonth = stamp.getUTCMonth(),
                    offset = stamp.getUTCDay(),
                    [a, b] = this.selected
                this.panels = { y: stamp.getUTCFullYear(), m: smonth + 1 }
                let { notopen, soldout, notBefore, notAfter } = this.config
                if (notBefore) {
                    notBefore = new Date(notBefore)
                    notBefore.setUTCHours(0, 0, 0, 0)
                }
                if (notAfter) {
                    notAfter = new Date(notAfter)
                    notAfter.setUTCHours(0, 0, 0, 0)
                }
                for (let i = -offset; i < 42 - offset; i++) {
                    stamp.setUTCFullYear(year, month, i + 1)
                    let m = stamp.getUTCMonth(),
                        d = stamp.getUTCDate(),
                        date = stamp.toISOString().substr(0, 10),
                        closed = (notopen || '').includes(date),
                        isfull = (soldout || '').includes(date),
                        fake = m != smonth || closed || isfull || notBefore && (stamp < notBefore) || notAfter && (notAfter < stamp),
                        day = { fake, date, d, class: [], closed, isfull }
                    date == a.date ? a = day : null
                    date == b.date ? b = day : null
                    contents.push(day)
                }
                this.selected = [a, b]
                return contents
            },
            hover(day) {
                const [a, b] = this.selected
                if (this.mode == 'range' && a.date && !b.date) {
                    let x = this.Contents[0],
                        [y] = this.Contents.slice(-1)
                    let flip = !(x.date <= a.date && a.date <= y.date)
                    this.Contents.map(item => {
                        if (!item.fake && (item.date == a.date || item.date == day.date)) {
                            flip = !flip
                        } else {
                            item.class = flip ? ['range'] : []
                        }
                    })
                }
            },
            select(day, init) {
                if (day.fake) {
                    return
                }
                const [a, b] = this.selected
                if (this.mode == 'range') {
                    b.class = []
                    if (!a.date || b.date) {
                        a.class = []
                        day.class.push('active')
                        this.selected = [day, {}]
                    } else if (!b.date) {
                        day.class.push('active')
                        this.selected = [a, day]
                    } else {
                        a.class = []
                        this.selected = [{}, {}]
                    }
                    const start = this.Contents[0].date,
                          [x, y] = this.selected
                    let flip = x.date < start && y.date > start
                    this.Contents.map(item => {
                        if (!item.fake && (item.date == x.date || item.date == y.date)) {
                            flip = !flip
                        } else if (flip && y.date) {
                            item.class = ['range']
                        } else {
                            item.class = []
                        }
                    })
                    init || !y.date || this.$emit('setDate', ...[x.date, y.date].sort())
                } else {
                    a.class = []
                    day.class = ['active']
                    this.selected = [day, {}]
                    init || this.$emit('setDate', day.date)
                }
            }
        }
    }
    let i18n = {
        '休': {
            en: 'Close'
        },
        '满': {
            en: 'Full'
        },
        '日': {
            en: 'Sun'
        },
        '一': {
            en: 'Mon'
        },
        '二': {
            en: 'Tue'
        },
        '三': {
            en: 'Wed'
        },
        '四': {
            en: 'Thu'
        },
        '五': {
            en: 'Fri'
        },
        '六': {
            en: 'Sat'
        },
        0: {
            en: 'JAN',
            cn: '一月'
        },
        1: {
            en: 'FEB',
            cn: '二月'
        },
        2: {
            en: 'MAR',
            cn: '三月'
        },
        3: {
            en: 'APR',
            cn: '四月'
        },
        4: {
            en: 'MAY',
            cn: '五月'
        },
        5: {
            en: 'JUN',
            cn: '六月'
        },
        6: {
            en: 'JUL',
            cn: '七月'
        },
        7: {
            en: 'AUG',
            cn: '八月'
        },
        8: {
            en: 'SEP',
            cn: '九月'
        },
        9: {
            en: 'OCT',
            cn: '十月'
        },
        10: {
            en: 'NOV',
            cn: '十一月'
        },
        11: {
            en: 'DEC',
            cn: '十二月'
        },
    }
</script>
<style>
    .calendar {
        padding: .5rem;
        text-align: center;
        line-height: 3rem;
        user-select: none;
        background: white;

        /* max-width: 40rem; */
        margin: 0 auto;
        .title {
            display: flex;
            line-height: 3rem;
            button {
                width: 3rem;
                cursor: pointer;
                outline: none;
                border: none;
                background: none;
            }
            strong {
                flex: 1 1 auto;
            }
        }
        .grid7 {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
        }
        .grid4 {
            display: grid;
            padding: 0 1rem;
            grid-template-columns: repeat(4, 1fr);
        }
        .body {
            color: #0003;
            label {
                position: relative;
                display: block;
                margin: 0;
            }
            span {
                display: block;
                color: #0009;
                &.range {
                    background: #9accfd55;
                    border-radius: 1.5rem;
                    color: #000b;
                }
                &.active,
                &:hover {
                    cursor: pointer;
                    border-radius: 1.5rem;
                    background: #409eff68;
                    color: #fff;
                }
            }
            >div:hover span {
                color: #000;
            }
            .today {
                text-decoration: var(--blue) underline 2px;
                -webkit-text-underline-offset: .25em;
                text-underline-offset: .25em;
            }
        }
    }
</style>
