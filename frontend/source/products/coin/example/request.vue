<template>
    <div id="request-intro">
        <Navigation />
        <div class="h3">基本语法</div>
        <code class="mb-3">this.request(apiName, params, method)</code>
        <ul class="list-group">
            <li class="list-group-item">
                <code>apiName[String]</code> 接口地址
                <ul>
                    <li>通过Proxy代理的api地址，例如： @dashboard/models</li>
                    <li>chameleon封装的接口， 例如： System/ListFileLogs</li>
                    <li>直接可访问的api地址，例如： http://192.168.1.123/v1/models</li>
                </ul>
            </li>
            <li class="list-group-item">
                <code>params[Object]</code> 接口需要的参数
                <div>必须为 Object</div>
            </li>
            <li class="list-group-item">
                <code>method[String]</code> 请求方法，['GET', 'POST', 'PUT', 'DELETE']
                <div>可选；默认POST</div>
            </li>
        </ul>
        <pre class="text-success">.resolve(success => {
        // 此处代码只会在接口调用成功时执行
        // success 为接口返回的数据
    })</pre>
        <pre class="text-danger">.reject((error, body, href) => {
        // 此处代码只会在接口调用失败时执行
        // error 错误标题
        // body 返回的全部内容，可能是json， 也可能是html
        // href 调用的地址，debug用
    })</pre>
        <pre class="text-muted">.finally(noop => {
        // 不管成功失败，此处代码一定会执行
        // 比如完成清理之类的动作
    })</pre>
    </div>
</template>
<script>
    export default {
        methods: {
            RefreshContents() {
                this.request('SomeApiReference', { arg1: 123, arg2: 'string', arg3: [1, 2, 3], arg4: { x: 1, y: 2 } }).resolve(success => {
                    // '此处代码只会在接口调用成功时执行'
                }).reject(error => {
                    // '此处代码只会在接口调用失败时执行'
                    // '此处如果返回falsy 将没有错误提示'
                    return '此处返回字符串将会提示用户'
                }).finally(noop => {
                    // '不管成功失败，此处一定会执行'
                })
            }
        }
    }
</script>
