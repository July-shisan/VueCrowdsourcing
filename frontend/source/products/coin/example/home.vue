<template>
    <div>
        <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css"> -->
        <!-- <script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js" />
        <script src="/static/echarts/echarts.min.js" /> -->
        <section class="hero is-medium is-info-cover">
            <div class="hero-body">
                <div class="columns">
                    <div class="column is-10 is-offset-1">
                        <section class="hero landing-left">
                            <div>
                                <div>
                                    <h1 class="title has-text-centered has-text-weight-bold" style="color: white;">
                                        <div>
                                            <span class="no-wrap"> ACT-BUAA </span>
                                        </div>
                                        <div>
                                            <p>Make Industy Better! </p>
                                        </div>
                                    </h1>
                                    <h2 class="subtitle" />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <form id="searchform" method="get" action="">
                    <div class="columns">
                        <div class="column is-6-fullhd is-6-desktop is-6-tablet is-offset-3-fullhd is-offset-3-desktop is-offset-3-tablet">
                            <div class="get-started-transparent">
                                <div keep-first="true">
                                    <div class="get-started-section">
                                        <div class="field is-grouped">
                                            <input id="keyword" class="input" placeholder="搜索任务" required>
                                            <input type="submit" class="button is-primary" form="searchform" value="搜索" onclick="getkey(this)">
                                            <a class="button is-primary" href="/releaseOne2One/">发布需求</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
        <!-- <ul class="list-group"> -->
        <!-- <router-link to="/example/request" class="list-group-item">接口调用示例</router-link>
                <router-link to="/example/popover" class="list-group-item">提示窗</router-link>
                <router-link to="/example/popwindow" class="list-group-item">页面标准弹窗</router-link>
                <router-link to="/example/confirmation" class="list-group-item">确认弹窗，一般供删除使用</router-link> -->
        <!-- <li class="list-group-item">To Do</li> -->
        <!-- <li v-for="item in a.challenge" :key="item.Key" class="list-group-item">
                <h5>
                    <strong>{{ item.Record.task_name }}</strong>
                </h5>
                <br>
                {{ item.Record.detail }}
            </li>
        </ul> -->
        <div class="section">
            <div class="container">
                <div class="columns" style="margin-bottom: 0;">
                    <div class="column">
                        <meta content="Find the best Sivvy alternatives based on our research Microsoft Azure Active Directory, Oracle Identity Manager, Okta, Centrify, and OneLogin."
                              itemprop="description"
                        >
                        <div class="tabs-title no-transform">
                            <h1 class="title is-3" itemprop="name headline">任务列表</h1>
                        </div>
                    </div>
                </div>
                <div class="columns">
                    <main class="column is-9">
                        <div class="tabs">
                            <ul class="wrap">
                                <li class=" ">
                                    <a href="/">活跃中</a>
                                </li>
                                <li class="">
                                    <a href="" rel="nofollow">已经完成</a>
                                </li>
                                <li class="">
                                    <a href="" rel="nofollow">所有任务</a>
                                </li>
                            </ul>
                        </div>
                        <li v-for="task in a.challenge" :key="task.Key" class="box">
                            <div class="media-content">
                                <div class="content">
                                    <div class="title-columns columns is-gapless is-mobile">
                                        <div class="column">
                                            <h3 class="title is-4">
                                                <a v-if="task.Key" class="prefetch" href=""><span
                                                    class="badge-verified"
                                                />{{ task.Record.task_name }}
                                                </a>

                                                <a v-else class="prefetch" href=""><span
                                                    class="badge-verified"
                                                />{{ task.task_name }}</a>
                                            </h3>
                                        </div>
                                    </div>

                                    <p v-if="task.Key" class="tagline text-small">{{ task.Record.detail }}</p>

                                    <p v-else class="tagline text-small">{{ task.detail }}</p>


                                    <p v-if="task.Key" class="tagline text-small">{{ task.Record.state }}</p>

                                    <p v-else class="tagline text-small">{{ task.state }}</p>
                                </div>
                                <div class="columns is-mobile">
                                    <div class="column">
                                        <p v-if="task.Key">reward: {{ task.Record.reward }}</p>


                                        <p v-else>reward: {{ task.reward }}</p>
                                    </div>
                                    <div class="column is-narrow">
                                        <p v-if="task.Key">deadline time: {{ task.Record.deadline }}</p>

                                        <p v-else>deadline time: {{ task.deadline }}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <br>
                    </main>
                    <aside class="column sidebar">
                        <div v-if="a.hot_tasks" class="box">
                            <h5 class="title is-5">热门任务列表</h5>
                            <ul class="sidebar-categories-list">
                                <li v-for="t in a.hot_tasks" :key="t.Record.task_id">
                                    <a class="prefetch" href="">{{ t.Record.task_name }}</a>
                                </li>
                                <br>
                            </ul>
                        </div>


                        <div v-if="a.hot_users" class="box">
                            <h5 class="title is-5">受欢迎的开发者</h5>
                            <ul class="sidebar-categories-list">
                                <li v-for="u in a.hot_users" :key="u.user_name">
                                    <a class="prefetch" href="">{{ u.user_name }}</a>
                                </li>
                                <br>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                a: {},
            }
        },
        created() {
            this.request('http://192.168.2.139:8000/task/list', {}, 'GET')
                .resolve((success) => {
                    this.a = success
                    // console.log('success')
                })
                .reject((error, body, href) => {
                    console.log(error, body, href)
                })
        },
        mounted() {},
        methods: {},
    }
</script>