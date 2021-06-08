<template>
    <div class="pop-mask product" :class="'product-'+Product.pin">
        <div class="card bg-secondary text-light max-w50">
            <div class="card-header">{{Product.title}}</div>
            <div class="card-body">
                <div class="display-4 font-weight-normal text-center">{{Security.LicenseInvalid|i18n('errors')}}</div>
                <hr>
                <div class="row">
                    <span class="col-4 text-end">Version: </span>
                    <span class="col">{{Product.version}}</span>
                </div>
                <div class="row">
                    <span class="col-4 text-end">Build: </span>
                    <span class="col">{{Product.build}} {{Product.Revision}}</span>
                </div>
                <div class="row">
                    <span class="col-4 text-end">Release: </span>
                    <span class="col">{{Product.release|datetime(false)}}</span>
                </div>
                <div class="row">
                    <span class="col-4 text-end">DeviceID: </span>
                    <span class="col">{{Product.din}}</span>
                </div>
                <div class="row">
                    <span class="col-4 text-end">Server Time: </span>
                    <span class="col">
                        <span class="font-monospace">{{(BrowserTime - Security.TimeOffset)|datetime}}</span>
                        <span class="badge bg-warning text-dark" @click="Dialogs.SyncSystemTime=true">
                            <i class="bi bi-lg bi-clock" :title="'sync-server-time'|i18n(i18n)" />
                        </span>
                    </span>
                </div>
                <template v-if="Security.notAfter && Security.notBefore">
                    <p />
                    <div class="row">
                        <span class="col-4 text-end">{{'Authorized to'|i18n(i18n)}}: </span>
                        <span class="col text-light">{{Security.licenseTo||"-"}}</span>
                    </div>
                    <div class="row">
                        <span class="col-4 text-end">{{'license-period'|i18n(i18n)}}: </span>
                        <span class="col text-light">{{Security.notBefore|datetime}} ~ {{Security.notAfter|datetime}}</span>
                    </div>
                    <div class="row">
                        <span class="col-4 text-end">{{'last-boot'|i18n(i18n)}}: </span>
                        <span class="col text-warning">{{Security.LastStartup|datetime}}</span>
                    </div>
                </template><template v-else />
            </div>
            <div class="card-title text-center">
                <div>Copyright &copy; {{Product.copyright|ccyear}}</div>
                <div v-if="Product.psfn">{{Product.psfn}}</div><template v-else />
            </div>
            <div class="card-footer text-end">
                <span class="btn btn-success" @click="Dialogs.UpdateLicense=true">{{'update-license'|i18n(i18n)}}</span>
            </div>
        </div>
        <FileUploader v-if="Dialogs.UpdateLicense" :dismiss="CloseDialogs" :Done="UpdateLicense" FileExtension="key">
            <template #title>{{'update-license'|i18n(i18n)}}</template>
        </FileUploader>
        <Confirmation v-else-if="Dialogs.SyncSystemTime" :dismiss="CloseDialogs" :Done="Security.SyncDisabled?false:SyncSystemTime">
            <template #title>{{'sync-title'|i18n(i18n)}}</template>
            {{'sync-server-time'|i18n(i18n)}}
            <div>{{BrowserTime|datetime}}</div>
            <template #alert>
                Server Time: {{(BrowserTime - Security.TimeOffset)|datetime}}
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
                    UpdateLicense: false,
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
        beforeDestroy() {
            clearInterval(this.TickTimer)
        },
        methods: {
            UpdateLicense(fileInfo) {
                this.request('System/UpdateLicense', { ...fileInfo[0] }).finally(this.CloseDialogs)
            },
            SyncSystemTime() {
                this.request('System/UpdateTimer', { clientStamp: Date.now() }).finally(this.CloseDialogs)
            },
            CloseDialogs() {
                for (let name in this.Dialogs) {
                    this.Dialogs[name] = false
                }
            }
        }
    }
    let i18n = {
        'sync-title': {
            en: 'System Maintenance',
            cn: '系统维护'
        },
        'sync-server-time': {
            en: 'Synchronize server time',
            cn: '同步服务器时间'
        },

        'Authorized to': {
            cn: '授权给'
        },
        'license-period': {
            en: 'License Period',
            cn: '许可期限'
        },
        'last-boot': {
            en: 'Last boot',
            cn: '上次启动'
        },
        'update-license': {
            en: 'Update License',
            cn: '更新许可证'
        },
    }
</script>
