<template>
    <div class="pop-mask product" :class="'product-'+Product.pin">
        <form id="LoginPassword" v-escape="dismiss" class="card max-w50" autocomplete="off" @submit.prevent="doAction">
            <div class="card-header text-center">{{'Personal Preferences'|i18n(i18n)}} - {{Product.title}}<button type="button" class="btn-close btn-close-white float-end" @click="dismiss" /></div>
            <div class="card-body">
                <div class="col-form-label">{{'current-state'|i18n(i18n)}}</div>
                <div class="alert alert-light font-monospace mb-0">
                    {{timeStamp|datetime(...localSetting)}}<br>
                    {{(timeStamp - 91.25*864e5)|datetime(...localSetting)}}<br>
                    {{(timeStamp - 182.5*864e5)|datetime(...localSetting)}}<br>
                    {{(timeStamp - 273.75*864e5)|datetime(...localSetting)}}
                </div>
                <div class="col-form-label">{{'Timezone'|i18n(i18n)}}</div>
                <select v-model="params.timezone" class="form-select">
                    <option v-for="item in preset.timezones" :key="item" :value="item">{{item}}</option>
                </select>
                <div class="col-form-label">{{'Date Format'|i18n(i18n)}}</div>
                <select v-model="params.datestring" class="form-select">
                    <option v-for="item in preset.datestrings" :key="item" :value="item">{{timeStamp|datetime(item)}}</option>
                </select>
                <div class="col-form-label">{{'Time Format'|i18n(i18n)}}</div>
                <select v-model="params.timestring" class="form-select">
                    <option v-for="item in preset.timestrings" :key="item" :value="item">{{'2012-11-22T12:34:56.000Z'|datetime(item)}}</option>
                </select>
                <div class="text-end mt-3">
                    <span class="btn btn-primary" @click="dismiss">{{'Confirm'|i18n('button')}}</span>
                </div>
            </div>
            <div class="card-footer text-center">
                <div>Copyright &copy; {{Product.copyright|ccyear}}</div>
                <div>{{Product.psfn}}</div>
            </div>
        </form>
        <span class="btn btn-light" @click="SwitchLang"><i class="bi bi-translate" /> {{'Switch Language'|i18n(i18n)}}</span>
    </div>
</template>
<script>
    const preset = {
        timezones: [
            'Asia/Shanghai',
            'America/Los_Angeles',
        ],
        datestrings: [
            'Y-MM-DD',
            'Y/MM/DD',
            'Y.MM.DD',

            'Y-M-D',
            'Y/M/D',
            'Y.M.D',

            'YY-M-D',
            'YY/M/D',
            'YY.M.D',
            'YY/MM/DD',

            'M/D/Y',
            'M/D/YY',
            'MM/DD/YY',
            'MM/DD/Y',
            'D-MMM-YY',
        ],
        timestrings: [
            'HH:mm:ss',
            'HH:mm:ss z',
            'HH:mm',
            'HH:mm z',

            'h:mm:ssA z',
            'h:mm:ssa z',
            'h:mmA z',
            'h:mma z',
        ]
    }
    export default {
        data() {
            return {
                timeStamp: Date.now(),
                params: {
                    timezone: 'Asia/Shanghai',
                    datestring: 'Y-MM-DD',
                    timestring: 'HH:mm:ss z'
                }
            }
        },
        computed: {
            i18n: () => i18n,
            preset: () => preset,
            localSetting() {
                let { timezone, datestring, timestring } = this.params
                return [datestring + ' ' + timestring, timezone]
            },
            Product() {
                return this.Helper.Product
            },
        },
        watch: {
            params: {
                handler: 'saveLocale',
                deep: true
            }
        },
        created() {
            try {
                let { locale } = this.Helper.Storage
                Object.assign(this.params, JSON.parse(locale))
            } catch (noop) { /*eslint-disable-line-no-empty*/ }
            this.timer = setInterval(noop => {
                this.timeStamp = Date.now()
            }, 1000)
        },
        beforeDestroy() {
            this.timer && clearInterval(this.timer)
        },
        methods: {
            saveLocale() {
                this.Helper.Storage.locale = JSON.stringify(this.params)
            },
            dismiss() {
                this.Helper.Profile.Localize = false
            }
        }
    }
    let i18n = {
        'Switch Language': {
            cn: 'En',
            en: '中'
        },
        'Personal Preferences': {
            cn: '个人偏好设置'
        },
        'current-state': {
            en: 'Current Localization Setting',
            cn: '当前区域设定'
        },
        'Timezone': {
            cn: '时区设定'
        },
        'Date Format': {
            cn: '日期格式'
        },
        'Time Format': {
            cn: '时间格式'
        },
    }
</script>
