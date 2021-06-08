<template>
    <div>
        <Navigation />
        <div class="card mb-3">
            <div class="card-header">标准弹窗带错误提示</div>
            <div class="card-body">
                <span class="btn btn-primary" @click="Dialogs.ShowWithConfirm=true">示例</span>
                <pre class="mb-0 mt-3">&lt;PopWindow v-if="SomeConditionIsTrue" :dismiss="CloseDialogs" :Done="DoSomeBackendRequest"&gt;
        &lt;template #title&gt;弹窗标题&lt;/template&gt;
        &lt;div&gt;当 Done="Function" 的时候，点击确认按钮将执行该函数&lt;/div&gt;
    &lt;/PopWindow&gt;</pre>
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-header">弹窗无错误提示</div>
            <div class="card-body">
                <span class="btn btn-primary" @click="Dialogs.ShowNoErrorTip=true">示例</span>
                <pre class="mb-0 mt-3">&lt;PopWindow v-if="SomeConditionIsTrue" :dismiss="CloseDialogs" :Done="NoErrorTip"&gt;
        &lt;template #title&gt;弹窗标题&lt;/template&gt;
        &lt;div&gt;当 Done="Function" 的时候，点击确认按钮将执行该函数&lt;/div&gt;
    &lt;/PopWindow&gt;</pre>
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-header">弹窗无需确认</div>
            <div class="card-body">
                <span class="btn btn-primary" @click="Dialogs.ShowNoConfirm=true">示例</span>
                <pre class="mb-0 mt-3">&lt;PopWindow v-if="SomeConditionIsTrue" :dismiss="CloseDialogs" :Done="false"&gt;
        &lt;template #title&gt;弹窗标题&lt;/template&gt;
        &lt;div&gt;当 Done="false" 的时候，没有确认按钮&lt;/div&gt;
    &lt;/PopWindow&gt;</pre>
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-header">弹窗需要密码确认</div>
            <div class="card-body">
                <span class="btn btn-primary" @click="Dialogs.ShowWithVerifyPassword=true">示例</span>
                <pre class="mb-0 mt-3">&lt;PopWindow v-if="SomeConditionIsTrue" :dismiss="CloseDialogs" :Done="DoSomeBackendRequest" :VerifyPassword="true"&gt;
        &lt;template #title&gt;弹窗标题&lt;/template&gt;
        &lt;div&gt;当 :VerifyPassword="true" 的时候，确认操作需要同时携带当前帐号的密码，验证通过后才会执行&lt;/div&gt;
    &lt;/PopWindow&gt;</pre>
            </div>
        </div>

        <PopWindow v-if="Dialogs.ShowWithConfirm" :dismiss="CloseDialogs" :Done="DoSomeBackendRequest">
            <template #title>标准弹窗带错误提示</template>
            <div>当 Done="Function" 的时候，点击确认按钮将执行该函数</div>
        </PopWindow>
        <PopWindow v-else-if="Dialogs.ShowNoErrorTip" :dismiss="CloseDialogs" :Done="NoErrorTip">
            <template #title>弹窗无错误提示</template>
            <div>当 Done="Function" 的时候，点击确认按钮将执行该函数</div>
        </PopWindow>
        <PopWindow v-else-if="Dialogs.ShowNoConfirm" :dismiss="CloseDialogs" :Done="false">
            <template #title>弹窗标题</template>
            <div>当 Done="false" 的时候，没有确认按钮</div>
        </PopWindow>
        <PopWindow v-else-if="Dialogs.ShowWithVerifyPassword" :dismiss="CloseDialogs" :Done="DoSomeBackendRequest" :VerifyPassword="true">
            <template #title>PopWindow Title</template>
            <div>当 :VerifyPassword="true" 的时候，确认操作需要同时携带当前帐号的密码，验证通过后才会执行</div>
        </PopWindow><template v-else />
        <div v-if="ResultTip" class="alert alert-info mt-3">{{ResultTip}}</div><template v-else />
    </div>
</template>
<script>
    export default {
        data() {
            return {
                ResultTip: '',
                Dialogs: {
                    ShowNoConfirm: false,
                    ShowNoErrorTip: false,
                    ShowWithConfirm: false,
                    ShowWithVerifyPassword: false
                }
            }
        },
        methods: {
            CloseDialogs() {
                for (let name in this.Dialogs) {
                    this.Dialogs[name] = false
                }
            },
            DoSomeBackendRequest(VerifyPassword) {
                this.request('https://www.baidu.com/', { VerifyPassword }).resolve(success => {
                    this.ResultTip = '此处返回正常结果'
                }).reject((error, body, href) => {
                    this.ResultTip = { error, body, href }
                    // console.log('如果出错，此处返回错误详情', )
                    return error
                })
            },
            NoErrorTip() {
                this.request('https://www.baidu.com/', {}).resolve(success => {
                    this.ResultTip = '此处返回正常结果'
                }).reject((error, body, href) => {
                    this.ResultTip = { error, body, href }
                    // console.log('如果出错，此处返回错误详情', )
                })
            }
        }
    }
</script>
