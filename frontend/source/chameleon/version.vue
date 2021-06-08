<template>
    <div>
        <Navigation />
        <div class="card mx-auto mt-5">
            <div class="card-header">{{Product.title}}</div>
            <div class="text-center h5 m-0">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <div class="site-logo" />
                    </li>
                    <li class="list-group-item">
                        <span class="badge rounded-pill bg-light text-dark">Version: {{Product.version}}</span>
                        <span class="badge rounded-pill bg-light text-dark">Build: {{Product.build}}</span>
                        <span class="badge rounded-pill bg-light text-dark">{{Product.Revision}}</span>
                        <span class="badge rounded-pill bg-light text-dark">Release: {{Product.release|datetime(false)}}</span>
                    </li>
                    <li class="list-group-item"><i class="bi bi-globe2" /> {{'homepage'|i18n(i18n)}}: <a :href="Product.homepage" target="_blank">{{Product.homepage}}</a></li>
                    <li class="list-group-item px-5">
                        <div>Copyright &copy; {{Product.copyright|ccyear}}</div>
                        <div>{{Product.psfn}}</div>
                    </li>
                </ul>
                <ul class="list-group list-group-flush mt-5">
                    <li class="list-group-item">{{'authorized-to'|i18n(i18n)}}: {{Security.licenseTo}}</li>
                    <li class="list-group-item">{{'authorized-id'|i18n(i18n)}}: {{Product.din}}</li>
                    <li class="list-group-item">{{'license-period'|i18n(i18n)}}: <span class="text-success">{{Security.notBefore|datetime}} ~ {{Security.notAfter|datetime}}</span></li>
                    <li class="list-group-item">
                        <span>{{'server-time'|i18n(i18n)}}: {{(BrowserTime - Security.TimeOffset)|datetime}}</span>
                        <span class="badge rounded-pill bg-primary text-light" role="button" :title="'sync-server-time'|i18n(i18n)" @click="Dialogs.SyncSystemTime=true">
                            <i class="bi bi-clock-fill" />
                        </span>
                    </li>
                </ul>
            </div>
            <div class="card-footer text-center">
                <span class="btn btn-warning" @click="Dialogs.UpgradeSystem=true">升级系统</span>
                <span class="btn btn-success" @click="Dialogs.UpgradeLicense=true">{{'Update License'|i18n(i18n)}}</span>
            </div>
        </div>
        <FileUploader v-if="Dialogs.UpgradeSystem" :dismiss="CloseDialogs" :Done="SystemUpgradePrecheck" :VerifyPassword="true" FileExtension="bin">
            <template #title>升级主程序</template>
        </FileUploader>
        <FileUploader v-else-if="Dialogs.UpgradeLicense" :dismiss="CloseDialogs" :Done="UpgradeLicense" :VerifyPassword="true" FileExtension="key">
            <template #title>{{'Update License'|i18n(i18n)}}</template>
        </FileUploader>
        <Confirmation v-else-if="Dialogs.SyncSystemTime" :dismiss="CloseDialogs" :Done="Security.SyncDisabled?false:SyncSystemTime" :VerifyPassword="!Security.SyncDisabled">
            <template #title>{{'sync-title'|i18n(i18n)}}</template>
            {{'sync-server-time'|i18n(i18n)}}
            <div>{{BrowserTime|datetime}}</div>
            <template #alert>
                {{'server-time'|i18n(i18n)}}: {{(BrowserTime - Security.TimeOffset)|datetime}}
                <div v-if="Security.SyncDisabled" class="text-muted">{{Security.SyncDisabled|i18n}}</div><template v-else />
            </template>
        </Confirmation><template v-else />
    </div>
</template>
<script>
    export default {
        data() {
            return {
                BrowserTime: Date.now(),

                Dialogs: {
                    UpgradeLicense: false,
                    UpgradeSystem: false,
                    SyncSystemTime: false
                },
            }
        },
        computed: {
            i18n: () => i18n,
            Security() {
                return this.Helper.Security
            },
            Product() {
                return this.Helper.Product
            },
        },
        created() {
            this.TickTimer = setInterval(noop => {
                this.BrowserTime = Date.now()
            }, 1000)
        },
        destroyed() {
            clearInterval(this.TickTimer)
        },
        methods: {
            SystemUpgradePrecheck(fileInfo, VerifyPassword) {
                this.request('sytem/upgrade/precheck', { ...fileInfo[0], VerifyPassword }).resolve(success => {
                    this.Alert('done, fake result')
                    this.Alert(success)
                }).finally(this.CloseDialogs)
            },
            UpgradeLicense(fileInfo, VerifyPassword) {
                this.request('System/UpdateLicense', { ...fileInfo[0], VerifyPassword }).finally(this.CloseDialogs)
            },
            SyncSystemTime(VerifyPassword) {
                this.request('System/UpdateTimer', { clientStamp: Date.now(), VerifyPassword }).finally(this.CloseDialogs)
            },
            CloseDialogs() {
                for (let name in this.Dialogs) {
                    this.Dialogs[name] = false
                }
            },
        }
    }
    let i18n = {
        'Update License': {
            cn: '更新许可证'
        },
        'homepage': {
            en: 'Homepage',
            cn: '产品主页'
        },
        'server-time': {
            en: 'Server Time',
            cn: '服务器时间'
        },

        'authorized-to': {
            en: 'Authorized to',
            cn: '授权给'
        },
        'authorized-id': {
            en: 'Authorized device ID',
            cn: '授权设备ID'
        },
        'sync-title': {
            en: 'System Maintenance',
            cn: '系统维护'
        },
        'sync-server-time': {
            en: 'Synchronize server time',
            cn: '同步服务器时间'
        },
        'license-period': {
            en: 'License Period',
            cn: '许可期限'
        },
    }
</script>
