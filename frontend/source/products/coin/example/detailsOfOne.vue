<template>
    <div>
        <div class="section">
            <div class="container">
                <div class="columns">
                    <div class="column is-two-thirds">
                        <h2 class="title is-4">{{ a.task.task_name }}</h2>
                        <div class="box">
                            <p>Type: {{ a.task.task_type }}</p>
                            <br>
                            {#                        <p>tasktype: {{ a.task.specific_type }}</p>#}
                            <p>Detail: {{ a.task.detail }}</p>
                            <br>
                            <p>Technology: {{ a.task.technology }}</p>
                            <p>State: {{ a.task.state }}</p>
                            <p>Reward: {{ a.task.reward }}</p>
                            <br>
                            <p>Recieve time: {{ a.task.receive_time }}</p>
                            <p>Deadline: {{ a.task.deadline }}</p>
                        </div>
                        <br>
                        <!--                    <h2 class="title is-4">Developers Recommendation</h2>-->
                        <div class="columns">
                            <div class="column">
                                <h2 class="title is-4">Developers Recommendation</h2>
                            </div>
                            <div class="column is-narrow">
                                <a href="">Find Developers -></a>
                            </div>
                        </div>
                        <div v-if="a.name">
                            <div v-for="n in a.name" :key="n" class="box">
                                <h3 class="title is-5"><a href="">{{ n.user_name }}</a></h3>
                                <em>{{ n.skills }}</em>
                                <br>
                                <div class="columns is-mobile">
                                    <div class="column">
                                        <a href="">Learn more</a>
                                    </div>
                                    <div class="column is-narrow">
                                        <!--                                    <a href="/invite/{{n.user_name}}/{{task.task_name}}">👍 Invite</a>-->
                                        {% if task.invite_history == None or n.user_name not in task.invite_history %}
                                        <a v-if="a.task.invite_history == None" id="" onclick="">👍 Invite</a>

                                        <p v-else>👍 Invited</p>

                                        <p id="" style="display: none;">👍 Invited</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="box">
                            <p>无数据</p>
                        </div>
                    </div>
                    <div class="column">
                        <h2 class="title is-4">Similar Tasks</h2>
                        <div v-if="a.tasks">
                            {% for t in tasks %}
                            <div v-for="t in a.tasks" :key="t.Record.task_id" class="box">
                                <h3 class="title is-5">
                                    <a v-if="t.Key" class="prefetch" href=""><span
                                        class="badge-verified"
                                    />{{ t.Record.task_name }}
                                    </a>


                                    <a v-else class="prefetch" href=""><span
                                        class="badge-verified"
                                    />{{ t.task_name }}</a>
                                </h3>
                                <p v-if="t.Key" class="tagline text-small">{{ t.Record.detail }}</p>
                                <p v-else class="tagline text-small">{{ t.detail }}</p>
                            </div>
                        </div>

                        <div v-else class="box">
                            <p>无数据</p>
                        </div>
                    </div>
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
            this.request('http://192.168.2.139:8000/requester/createDetails', {}, 'GET')
                .resolve((success) => {
                    this.a = success
                    // console.log('success')
                    // {"title": "Details","task": task,"name": names,"tasks": tasks,}
                })
                .reject((error, body, href) => {
                    console.log(error, body, href)
                })
        },
        mounted() {},
        methods: {},
    }
</script>
