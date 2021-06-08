<template>
    <transition v-if="ShowConnect" enter-class="toggle" leave-to-class="toggle" appear>
        <div id="TipLoading" class="pop-mask text-nowrap">
            <div><i class="bi bi-lg bi-broadcast" /> {{'reconnecting'|i18n(i18n)}}</div>
        </div>
    </transition>
    <transition v-else-if="ShowLoading" enter-class="toggle" leave-to-class="toggle" appear>
        <div id="TipLoading" class="pop-mask text-nowrap">
            <div><i class="bi bi-lg bi-broadcast" /> {{'loading'|i18n(i18n)}}</div>
        </div>
    </transition>
    <transition v-else-if="MessageTimer>0" enter-class="toggle" leave-to-class="toggle" appear>
        <div id="TipMessage" class="alert alert-danger" @click="CopyMessage">
            <span class="close" @click="MessageTimer=1">&times;</span>
            <strong ref="ErrorMessage">{{Helper.TipMessage|i18n("errors")}}</strong>
        </div>
    </transition>
    <transition v-else-if="AuditingTimer>0" enter-class="toggle" leave-to-class="toggle" appear>
        <div id="TipAuditing" class="alert alert-warning font-weight-bold">{{'wait-audit'|i18n(i18n)}}</div>
    </transition>
    <div v-else-if="Progress" id="TipProgress">
        <div class="progress progress-bar-striped progress-bar-animated bg-secondary">
            <div class="progress-bar progress-bar-striped" :style="{width: Progress+'%'}">{{Progress}}%</div>
        </div>
    </div>
    <div v-else class="d-none" />
</template>
<script>
    export default {
        data() {
            return {
                ShowConnect: false,
                ShowLoading: false,
                ConnectTimer: 0,
                LoadingTimer: 0,
                MessageTimer: 0,
                AuditingTimer: 0,
            }
        },
        computed: {
            i18n: () => i18n,
            Progress() {
                let value = this.Helper.TipProgress
                return Math.round(Math.max(Math.min(1, value), 0) * 1e4) / 1e2
            }
        },
        watch: {
            'Helper.Connected': {
                handler: 'WatchConnect',
                immediate: true,
            },
            'Helper.TipLoading': 'WatchLoading',
            'Helper.TipAuditing': 'WatchAuditing',
            'Helper.TipMessage': 'WatchMessage',
        },
        methods: {
            WatchConnect(val) {
                if (val) {
                    this.ShowConnect = false
                    this.ConnectTimer = 0
                } else {
                    let running = this.ConnectTimer > 0
                    this.ConnectTimer = 120
                    running || animationTo(noop => this.ConnectTimer-- > 0 || Object.assign(this, { ShowConnect: !this.Helper.Connected }) && false)
                }
            },
            WatchLoading() {
                let running = this.LoadingTimer > 0
                this.LoadingTimer = 20
                running || animationTo(noop => this.LoadingTimer-- > 0 || Object.assign(this, { ShowLoading: !!this.Helper.TipLoading }) && false)
            },
            WatchAuditing(val) {
                let running = this.AuditingTimer > 0
                val && Object.assign(this, { AuditingTimer: 180 })
                running || !val || animationTo(noop => this.AuditingTimer-- > 0 || (this.Helper.TipAuditing = false))
            },
            WatchMessage(val) {
                let running = this.MessageTimer > 0
                val && Object.assign(this, { MessageTimer: 180 })
                running || !val || animationTo(noop => this.MessageTimer-- > 0 || (this.Helper.TipMessage = false))
            },
            CopyMessage() {
                let selection = document.getSelection()
                selection.selectAllChildren(this.$refs.ErrorMessage)
                document.execCommand('copy')
                selection.removeAllRanges()
            }
        }
    }
    let i18n = {
        'reconnecting': {
            en: 'Disconnected from the server, reconnect ...',
            cn: '与服务器的连接断开，重新连接 ...'
        },
        'loading': {
            en: 'Loading, please wait ...',
            cn: '加载中，请稍候 ...'
        },
        'wait-audit': {
            en: 'Waiting for audit',
            cn: '等待审计'
        },
    }
</script>
<style lang="scss">
    #TipMessage {
        position: fixed;
        top: 4rem;
        left: 50%;
        z-index: 3000;
        min-width: 40%;
        transform: translateX(-50%);
        transition: top 0.5s ease;
        &.toggle {
            top: -20%;
        }
    }
    #TipAuditing {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 3000;
        transition: top 0.5s ease;
        &.toggle {
            top: -20%;
        }
    }
    #TipLoading {
        transition: opacity .5s ease;
        color: white;
        opacity: 1;
        div {
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 1.8rem;
            line-height: 2.5;
            padding: .6em 2em;
            background-image: linear-gradient(to right, #0e47c4 0, #007bff 100%);
            border-radius: .2em;
            box-shadow: 0 0 2em .3em white;
        }
        &.toggle {
            opacity: 0;
        }
    }
    #TipProgress {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #00000040;
        z-index: 1001;
        .progress {
            position: absolute;
            left: 4rem;
            right: 4rem;
            bottom: 4rem;
            height: 3rem;
            font-size: x-large;
        }
    }
</style>
